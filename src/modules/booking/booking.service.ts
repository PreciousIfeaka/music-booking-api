import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Booking } from "./entities/booking";
import { Repository } from "typeorm";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { EventService } from "../events/event.service";
import { ArtistService } from "../artist/artist.service";
import { UpdateBookingStatusDto } from "./dto/update-booking.dto";
import { UserService } from "../users/user.service";
import { ArtistProfile } from "../artist/entities/artist-profile";
import { User } from "../users/entities/user";
import { Event } from "../events/entities/event";

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private eventService: EventService,
    private artistService: ArtistService,
    private userService: UserService

  ) {}

  private sendBookingResponse(booking: Booking) {
    return {
      id: booking.id,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      deleted_at: booking.deleted_at,
      status: booking.status,
      agreed_price: booking.agreed_price,
      event: booking.event.id as unknown as Event,
      artist: booking.artist.id as unknown as ArtistProfile,
      organizer: booking.organizer.id as unknown as User
    }
  }

  async createBooking(user_id: string, payload: CreateBookingDto): Promise<{
    message: string,
    booking: Partial<Booking>
  }> {
    const { artist_id, status, event_id, agreed_price } = payload;
    const { event } = await this.eventService.findEventById(event_id);
    const { artist } = await this.artistService.getArtistProfileById(artist_id);
    const { user } = await this.userService.findUser(user_id);

    // if (event.organizer !== user) throw new UnauthorizedException("Unauthorized access to book an artist for this event");

    const booking = this.bookingRepository.create({
      status,
      agreed_price,
      artist,
      event,
      organizer: user
    });

    await this.bookingRepository.save(booking);

    return {
      message: "Successfully created artist booking",
      booking: this.sendBookingResponse(booking)
    }
  }

  async getAllBookings(page: number = 1, limit: number = 10, user_id?: string): Promise<{
    message: string,
    bookings: Partial<Booking>[],
    meta: {
      total: number,
      current_page: number,
      total_pages: number
    }
  }> {
    let bookings: Booking[];
    let total: number;

    if (!user_id) {
      [ bookings, total ] = await this.bookingRepository.findAndCount({
        where: { organizer: { id: user_id } },
        relations: ["event", "artist", "organizer"],
        take: limit,
        skip: (page - 1) * limit
      });
    } else {
      [ bookings, total ] = await this.bookingRepository.findAndCount({
        relations: ["event", "artist", "organizer"],
        take: limit,
        skip: (page - 1) * limit
      });
    }

    return {
      message: "Successfully retrieved all bookings for the signed in user",
      bookings: bookings.map(booking => this.sendBookingResponse(booking)),
      meta: {
        total,
        current_page: page,
        total_pages: Math.ceil(total / limit)
      }
    }
  }

  async getBookingDataById(id: string): Promise<{
    message: string,
    booking: Partial<Booking>
  }> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ["event", "artist", "organizer"]
    });
    if (!booking) throw new NotFoundException("Booking of given ID not found");

    return {
      message: "Successfully retrieved booking data",
      booking: this.sendBookingResponse(booking)
    }
  }

  async updateBookingStatus(id: string, payload: UpdateBookingStatusDto): Promise<{
    message: string,
    booking: Partial<Booking>
  }> {
    const { booking } = await this.getBookingDataById(id);

    await this.bookingRepository.update(booking.id, payload);

    const { booking: updated_booking } = await this.getBookingDataById(id);

    return {
      message: "Successfully updated booking status",
      booking: updated_booking
    }
  }

  async deleteBookingData(id: string): Promise<{
    message: string
  }> {
    const deleted_booking = await this.bookingRepository.softDelete(id);
    if (deleted_booking.affected === 0) throw new BadRequestException("Could not deleted booking data, try again");

    return { message: "Successfully deleted booking data"}
  }
}