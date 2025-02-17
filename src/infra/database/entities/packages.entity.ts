import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity('Packages')
export class Packages {
  @PrimaryColumn()
  id?: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image?: string;

  @Column()
  owner_id: string;

  @Column({ type: 'jsonb', default: { allowed: false }, nullable: true })
  contact?: object | any;

  @Column({ default: null, nullable: true })
  logo?: string | null;

  @Column({ default: null, nullable: true })
  banner?: string | null;

  @Column({ default: null, nullable: true })
  favicon?: string | null;

  @Column({
    type: 'jsonb',
    default: { allowed: false, color: '#000000' },
    nullable: true,
  })
  color_header?: object;

  @Column({
    type: 'jsonb',
    default: { allowed: false, color: '#000000' },
    nullable: true,
  })
  background_color?: object;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'owner_id' })
  owner?: Users;
}
