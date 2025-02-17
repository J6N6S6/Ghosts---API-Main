import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('rewards')
export class Rewards {
  @PrimaryColumn()
  id?: string;

  @Column({
    type: 'float',
    default: 0,
  })
  goal: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  delivery_mode: string;

  @Column()
  available: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;
}
