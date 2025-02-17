import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { UsersActivity } from './user_activity.entity';

@Entity('user_sessions')
export class UserSessions {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column()
  device_name: string;

  @Column({
    type: 'enum',
    enum: ['MOBILE', 'DESKTOP', 'TABLET', 'OTHER'],
    default: 'OTHER',
  })
  device_type: string;

  @Column()
  session_origin: string;

  @Column()
  ip_address: string;

  @Column()
  token: string;

  @Column()
  token_expires: Date;

  @Column()
  refresh_token: string;

  @Column()
  refresh_token_expires: Date;

  @Column()
  last_activity: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: Users;

  @OneToMany(() => UsersActivity, (activity) => activity.session_id)
  activity?: UsersActivity[];
}
