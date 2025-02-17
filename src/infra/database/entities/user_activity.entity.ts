import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './users.entity';
import { UserSessions } from './user_sessions.entity';

@Entity('user_activity')
export class UsersActivity {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column()
  activity_type: string;

  @Column()
  ip_address: string;

  @Column({
    nullable: true,
  })
  session_id?: string;

  @Column({
    nullable: true,
  })
  activity?: string;

  @Column({
    type: 'jsonb',
    default: '{}',
  })
  metadata?: any;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @ManyToOne(() => Users, (user) => user.activity)
  @JoinColumn({ name: 'user_id' })
  user?: Users;

  @ManyToOne(() => UserSessions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'session_id' })
  session?: UserSessions;
}
