import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import ExtendedBaseEntity from "../../../base-entity";
import { User } from "../../users/entities/user";
import { Booking } from "../../booking/entities/booking";

export enum EventStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
  CANCELLED  = "Cancelled"
}

@Entity("events")
export class Event extends ExtendedBaseEntity {
  @ManyToOne(() => User, (organizer) => organizer.events, { onDelete: "CASCADE" })
  @JoinColumn({ name: "organizer" })
  organizer: User;

  @Column({ length: 150 })
  name: string;

  @Column({ type: "text" })
  description: string;

  @Column()
  location: string;

  @Column({ type: "timestamp" })
  event_date: Date;

  @Column({ type: "decimal", nullable: true })
  budget: number;

  @Column({ type: "text", array: true, nullable: true })
  required_genres: string[];

  @Column({ type: "enum", enum: EventStatus, default: EventStatus.PENDING })
  status: EventStatus;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];
}
