import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Booking } from "./entities/booking";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { EventModule } from "../events/event.module";
import { ArtistModule } from "../artist/artist.module";
import { UserModule } from "../users/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    EventModule,
    ArtistModule,
    UserModule
  ],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService]
})
export class BookingModule {}