import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_banking_accounts')
export class UserBankingAccounts {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column({ default: false })
  is_corporate: boolean;

  @Column()
  pix_key: string;

  @Column()
  pix_type: string;

  @Column({ nullable: true })
  name?: string;

  @Column()
  bank_name: string;

  @Column()
  bank_agency: string;

  @Column()
  bank_account: string;

  @Column({
    type: 'enum',
    enum: ['CC', 'CP'],
    default: 'CC',
  })
  bank_account_type: 'CC' | 'CP';

  @Column({ type: 'jsonb', nullable: true })
  additional_data?: object | any;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at?: Date;
}
