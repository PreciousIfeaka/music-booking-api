import { Controller, Post, Req, Headers, InternalServerErrorException, Logger, HttpCode, HttpStatus } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { Stripe } from "stripe";
import { PaymentStatus } from "./entities/payment";

@Controller("webhook")
export class WebhookController {
  private logger = new Logger(WebhookController.name)
  constructor(
    private configService: ConfigService,
    private paymentService: PaymentService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("stripe")
  async handleStripeWebhook(@Req() req: Request, @Headers("stripe-signature") signature: string) {
    const stripe = new Stripe(this.configService.get<string>("STRIPE_SECRET_KEY"), {
      apiVersion: "2025-03-31.basil",
    });
    const endpointSecret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET");

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
      this.logger.log(err);
      throw new InternalServerErrorException("Webhook signature verification failed");
    }

    switch (event.type) {
      case "checkout.session.completed":
        this.logger.log("Payment successful:", event.data.object);
        await this.paymentService.updatePaymentRecord(event.data.object.payment_intent, PaymentStatus.SUCCESSFUL);
        break;
      case "charge.refunded":
        this.logger.log("Payment refunded:", event.data.object);
        await this.paymentService.updatePaymentRecord(event.data.object.payment_intent, PaymentStatus.FAILED)
        break;
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
    return { received: true };
  }
}
