import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity('warns')
export class Warns {
  @PrimaryColumn()
  id?: string;

  @Column()
  title: string;

  @Column({ nullable: true, default: null })
  description?: string;

  @Column({ type: 'enum', enum: ['CRITICAL', 'LOW'] })
  status: 'CRITICAL' | 'LOW';

  @Column()
  created_by: string;

  @Column()
  created_at?: Date;

  @ManyToOne(() => Users, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  user: Users;
}
