import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity('user_reset_passwords')
export class UserResetPasswords {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column()
  code: string;

  @Column()
  expires: Date;

  @Column()
  used: boolean;

  @Column()
  ip_address: string;

  @Column()
  user_agent: string;

  @Column()
  left_attempts: number;

  @Column()
  blocked_until: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @ManyToOne(() => Users, (user) => user.activity)
  @JoinColumn({ name: 'user_id' })
  user?: Users;
}
