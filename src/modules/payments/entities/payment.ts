import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import ExtendedBaseEntity from "../../../base-entity";
import { Booking } from "../../booking/entities/booking";

export enum PaymentStatus {
  PENDING = "Pending",
  SUCCESSFUL = "Successful",
  FAILED = "Failed"
}

@Entity("payments")
export class Payment extends ExtendedBaseEntity {
  @OneToOne(() => Booking, (booking) => booking.payment,  { onDelete: "CASCADE" })
  @JoinColumn()
  booking: Booking;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: "decimal" })
  amount: number;

  @Column({ type: "text" })
  description: string

  @Column({ type: "varchar", nullable: true })
  payment_id: string;
}
