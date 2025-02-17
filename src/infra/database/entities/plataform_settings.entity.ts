import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('plataform_settings')
export class PlataformSettings {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id?: number;

  @Column({
    unique: true,
  })
  key: string;

  @Column()
  value: string;

  @Column({ default: null, nullable: true })
  description?: string;

  @Column({ default: null, nullable: true })
  user_id?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  lastEdit?: Date;

  @OneToOne(() => Users, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  lastEditedBy?: Users;
}
