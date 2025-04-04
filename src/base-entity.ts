import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { validateOrReject } from 'class-validator';
import { instanceToPlain } from 'class-transformer';

@Entity()
export class ExtendedBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deleted_at: Date;

  @BeforeInsert()
  async validateOnInsert() {
    try {
      await validateOrReject(this);
    } catch (error) {
      throw error;
    }
  }

  @BeforeUpdate()
  async validateOnUpdate() {
    try {
      await validateOrReject(this, { skipMissingProperties: true });
    } catch (error) {
      throw error;
    }
  }

  get isDeleted(): boolean {
    return !!this.deleted_at;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

export default ExtendedBaseEntity;
