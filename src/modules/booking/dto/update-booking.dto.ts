import { IsEnum, IsNotEmpty } from "class-validator";
import { BookingStatus } from "../entities/booking";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateBookingStatusDto {
  @ApiProperty()
  @IsEnum(BookingStatus, { message: "Status must be one of: Pending, Confirmed, Cancelled" })
  @IsNotEmpty({ message: "Booking status is required" })
  status: BookingStatus;
}