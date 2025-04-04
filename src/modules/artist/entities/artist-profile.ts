import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import ExtendedBaseEntity from "../../../base-entity";
import { Booking } from "../../booking/entities/booking";

@Entity()
export class ArtistProfile extends ExtendedBaseEntity {
  @Column()
  stage_name: string;

  @Column("text")
  bio: string;

  @Column({ type: "text", array: true })
  genres: string[];

  @Column({ type: "text", array: true, nullable: true })
  portfolio_urls: string[];

  @Column({ nullable: true })
  availability: string;

  @Column({ type: "decimal", nullable: true })
  price_per_hour: number;

  @Column({ nullable: true })
  location: string;

  @Column({ default: false })
  is_approved: boolean

  @OneToMany(() => Booking, (booking) => booking.artist, { nullable: true })
  bookings: Booking[];
}