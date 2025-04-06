import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingStatusDto } from "./dto/update-booking.dto";
import { AuthSessionGuard } from "../../guards/auth.guard";
import { RoleGuard } from "../../guards/role.guard";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { Roles } from "../../decorators/role.decorator";
import { Role } from "../users/entities/user";

@ApiBearerAuth()
@Controller("bookings")
@UseGuards(AuthSessionGuard, RoleGuard)
export class BookingController {
  constructor(
    private bookingService: BookingService
  ) {}

  @Post()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async createBooking(@Body() body: CreateBookingDto, @Req() request) {
    return this.bookingService.createBooking(request.user.user_id, body);
  }

  @Get("/me")
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number (default: 1)" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Number of results per page (default: 10)" })
  async retrieveOrganizerBookings(@Query("page") page: number, @Query("limit") limit: number, @Req() request) {
    return this.bookingService.getAllBookings(page ?? 1, limit ?? 10, request.user.user_id);
  }

  @Get()
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number (default: 1)" })
  @ApiQuery({ name: "limit", required: false, type: Number, description: "Number of results per page (default: 10)" })
  async retrieveAllBookings(@Query("page") page: number, @Query("limit") limit: number) {
    return this.bookingService.getAllBookings(page, limit);
  }

  @Get(":id")
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async retrieveBooking(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.bookingService.getBookingDataById(id);
  }

  @Put(":id/status")
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async updateBookingData(@Param("id", new ParseUUIDPipe()) id: string, @Body() body: UpdateBookingStatusDto) {
    return this.bookingService.updateBookingStatus(id, body);
  }

  @Delete(":id")
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async deleteBookingData(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.bookingService.deleteBookingData(id);
  }
}