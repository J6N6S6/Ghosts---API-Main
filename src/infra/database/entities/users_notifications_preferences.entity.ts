import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity('users_notifications_preferences')
export class UsersNotificationsPreferences {
  @PrimaryColumn()
  user_id: string;

  @Column({ default: true })
  MAIL_INDICATION_SALE?: boolean;

  @Column({ default: true })
  MAIL_NEW_INDICATION?: boolean;

  @Column({ default: true })
  MAIL_NEW_SALE_CONFIRM?: boolean;

  @Column({ default: true })
  MOBILE_APPROVED_SALES?: boolean;

  @Column({ default: true })
  MOBILE_GENERATED_PIX_AND_BANK_SLIP?: boolean;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user?: Users;
}
