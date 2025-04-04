import { Injectable, NotFoundException } from "@nestjs/common";
import { Stripe } from "stripe";
import { ConfigService } from "@nestjs/config";
import { CreatePaymentDto } from "./dtos/create-payment.dto";
import { RefundRequestDto } from "./dtos/refund-request.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment, PaymentStatus } from "./entities/payment";
import { Repository } from "typeorm";
import { BookingService } from "../booking/booking.service";

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private bookingService: BookingService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>
  ) {
    this.stripe = new Stripe(this.configService.get<string>("STRIPE_SECRET_KEY"), {
      apiVersion: "2025-03-31.basil",
    });
  }

  async createCheckoutSession(createPaymentDto: CreatePaymentDto, user_id: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: createPaymentDto.description,
            },
            unit_amount: createPaymentDto.amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${this.configService.get<string>("BASE_URL")}/success`,
      cancel_url: `${this.configService.get<string>("BASE_URL")}/cancel`,
      metadata: { user_id }
    });

    const payment_id = session.payment_intent;
    await this.createPaymentRecord(createPaymentDto, payment_id as string);
    return { session_id: session.id };
  }

  async createPaymentRecord(payload: CreatePaymentDto, payment_id: string): Promise<{
    message: string,
    payment: Payment
  }> {
    const { booking_id, amount, description } = payload;

    const {booking} = await this.bookingService.getBookingDataById(booking_id);

    const payment = this.paymentRepository.create({
      amount,
      description,
      booking,
      payment_id
    });

    await this.paymentRepository.save(payment);

    return {
      message: "Successfully created a payment record",
      payment
    }
  }

  async retrieveAllPaymentRecords(page: number = 1, limit: number = 10, user_id?: string): Promise<{
    message: string,
    payments: Payment[]
    meta: {
      total: number,
      current_page: number,
      total_pages: number
    }
  }> {
    let payments: Payment[];
    let total: number;

    if (user_id) {
      [ payments, total ] = await this.paymentRepository.findAndCount({
        where: { booking: { organizer: { id: user_id }}},
        take: limit,
        skip: (page - 1) * limit
      })
    } else {
      [ payments, total ] = await this.paymentRepository.findAndCount({
        take: limit,
        skip: (page - 1) * limit
      })
    }

    return {
      message: "Successfully retrieved all payments records",
      payments,
      meta: {
        total,
        current_page: page,
        total_pages: Math.ceil(total / limit)
      }
    }
  }

  async retrievePaymentRecord(id: string): Promise<{
    message: string,
    payment: Payment
  }> {
    const payment = await this.paymentRepository.findOne({ where: { id }});
    if (!payment) throw new NotFoundException("Payment record not found");

    return {
      message: "Successfully retrieved payment record",
      payment
    }
  }

  async updatePaymentRecord(payment_id: string, status: PaymentStatus): Promise<boolean> {
    const payment = await this.paymentRepository.findOne({ where: { payment_id }});
    if (!payment) throw new NotFoundException("Payment not found");

    await this.paymentRepository.update(payment_id, { status });

    return true
  }

  async getStripePaymentDetails(payment_id: string) {
    const payment = await this.paymentRepository.findOne({ where: { payment_id }});
    if (!payment) throw new NotFoundException("Could not retrieve payment details");

    return payment;
  }

  async getStripeTransactionHistory(user_id: string) {
    const payments = await this.stripe.paymentIntents.list({
      limit: 10,
    });
    return payments.data.filter(payment => payment.metadata?.userId === user_id);
  }

  async requestRefund(refundRequestDto: RefundRequestDto) {
    return this.stripe.refunds.create({
      payment_intent: refundRequestDto.payment_id,
      amount: refundRequestDto.amount ? refundRequestDto.amount * 100 : undefined,
    });
  }
}
