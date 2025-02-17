import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './users.entity';
import { Rewards } from './rewards.entity';

@Entity('user_rewards')
export class UserRewards {
  @PrimaryColumn()
  id?: string;

  @Column()
  reward_id: string;

  @Column({
    default: false,
  })
  claimed?: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  delivery_data?: any;

  @Column()
  user_id: string;

  @Column()
  status: 'pending' | 'pending_delivery' | 'delivered';

  @Column({
    nullable: true,
  })
  claimedAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user?: Users;

  @ManyToOne(() => Rewards)
  @JoinColumn({ name: 'reward_id' })
  reward?: Rewards;
}
