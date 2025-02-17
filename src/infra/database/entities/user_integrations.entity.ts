import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity('user_integrations')
export class UserIntegrationsEntity {
  @PrimaryColumn()
  id?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  push_cut?: {
    authorized_transaction_webhook_url: string;
    pending_transaction_webhook_url: string;
  };

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  utmfy?: {
    api_token: string;
  };

  @Column()
  user_id: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user?: Users;
}
