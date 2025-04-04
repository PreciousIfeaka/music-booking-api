import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { ArtistProfile } from "../../artist/entities/artist-profile";
import ExtendedBaseEntity from "../../../base-entity";
import { Event } from "../../events/entities/event";
import { User } from "../../users/entities/user";
import { Payment } from "../../payments/entities/payment";

export enum BookingStatus {
  CONFIRMED = "Confirmed",
  PENDING = "Pending",
  CANCELLED = "Cancelled"
}

@Entity("bookings")
export class Booking extends ExtendedBaseEntity {
  @ManyToOne(() => Event, (event) => event.bookings, { onDelete: "CASCADE" })
  event: Event;

  @ManyToOne(() => ArtistProfile, (artist) => artist.bookings, { onDelete: "CASCADE" })
  @JoinColumn()
  artist: ArtistProfile;

  @Column({ type: "enum", enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: "decimal" })
  agreed_price: number;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: "CASCADE" })
  @JoinColumn()
  organizer: User;

  @OneToOne(() => Payment, (payment) => payment.booking, { nullable: true })
  payment: Payment;
}
