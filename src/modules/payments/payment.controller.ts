import { Controller, Post, Get, Param, Body, Req, UseGuards, ParseUUIDPipe, Query, Put } from "@nestjs/common";
import { CreatePaymentDto } from "./dtos/create-payment.dto";
import { PaymentService } from "./payment.service";
import { RefundRequestDto } from "./dtos/refund-request.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthSessionGuard } from "../../guards/auth.guard";
import { Request } from "express";
import { RoleGuard } from "../../guards/role.guard";
import { Roles } from "../../decorators/role.decorator";
import { Role } from "../users/entities/user";

@ApiBearerAuth()
@Controller("payments")
@UseGuards(AuthSessionGuard, RoleGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("checkout")
  @Roles(Role.ARTIST, Role.ADMIN)
  async initiatePayment(@Body() body: CreatePaymentDto, @Req() request) {
    return this.paymentService.createCheckoutSession(body, request.user.user_id);
  }

  @Get("me")
  @Roles(Role.ARTIST, Role.ADMIN)
  async retrieveAllUsersPaymentRecords(@Query("page") page: number, @Query("limit") limit: number, @Req() req: Request) {
    return this.paymentService.retrieveAllPaymentRecords(page, limit, req.user.user_id)
  }

  @Get()
  @Roles(Role.ARTIST, Role.ADMIN)
  async retrieveAllPaymentRecords(@Query("page") page: number, @Query("limit") limit: number) {
    return this.paymentService.retrieveAllPaymentRecords(page, limit)
  }

  @Get(":id")
  @Roles(Role.ARTIST, Role.ADMIN)
  async getPaymentRecord(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.paymentService.retrievePaymentRecord(id);
  }

  @Get(":id/stripe")
  @Roles(Role.ARTIST, Role.ADMIN)
  async getStripePaymentDetails(@Param("id") paymentId: string) {
    return this.paymentService.getStripePaymentDetails(paymentId);
  }

  @Get("history/stripe")
  @Roles(Role.ARTIST, Role.ADMIN)
  async getStripeTransactionHistory(@Req() request) {
    return this.paymentService.getStripeTransactionHistory(request.user.user_id);
  }

  @Post("refund")
  @Roles(Role.ARTIST, Role.ADMIN)
  async requestRefund(@Body() body: RefundRequestDto) {
    return this.paymentService.requestRefund(body);
  }
}