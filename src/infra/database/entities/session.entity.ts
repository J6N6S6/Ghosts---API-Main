import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Transactions } from './transactions.entity';

@Entity('decrypted_sessions')
export class SessionEntity {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_email: string;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column()
  origin: string;

  @Column()
  available_balance: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;
}
