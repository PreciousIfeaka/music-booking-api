import { Exclude } from "class-transformer";
import { Column, Entity, OneToMany } from "typeorm";
import ExtendedBaseEntity from "../../../base-entity";
import { Booking } from "../../booking/entities/booking";
import { Event } from "../../events/entities/event";

export enum Role {
  ARTIST = "Artist",
  ORGANIZER = "Organizer",
  ADMIN = "Admin"
}


@Entity("users")
export class User extends ExtendedBaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string

  @Column()
  @Exclude()
  password: string

  @Column()
  is_verified: true

  @Column()
  role: Role;

  @Column({ nullable: true })
  avatar_url: string;

  @OneToMany(() => Event, (events) => events.organizer)
  events: Event[];

  @OneToMany(() => Booking, (bookings) => bookings.organizer, { nullable: true })
  bookings: Booking[];
}