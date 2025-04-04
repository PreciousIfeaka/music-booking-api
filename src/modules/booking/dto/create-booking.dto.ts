import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { BookingStatus } from "../entities/booking";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty({ message: "Artist stage name is required"})
  artist_id: string;

  @ApiProperty()
  @IsEnum(BookingStatus, { message: "Status must be one of: Pending, Confirmed, Cancelled" })
  @IsNotEmpty({ message: "Booking status is required"})
  status: BookingStatus;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  agreed_price: number

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  event_id: string
}