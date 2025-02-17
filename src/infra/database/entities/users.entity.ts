import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Taxes } from './taxes.entity';
import { UsersActivity } from './user_activity.entity';
import { UserOldPasswords } from './user_old_passwords.entity';
import { UserSessions } from './user_sessions.entity';
import { UsersNotificationsPreferences } from './users_notifications_preferences.entity';
import { Warns } from './warns.entity';

@Entity('Users')
export class Users {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column({ default: '' })
  name_exibition?: string;

  @Column({ nullable: true, default: null })
  password?: string;

  @Column({ nullable: true, default: null })
  reset_password_code?: string;

  @Column({ nullable: true, default: null })
  mfa_code?: string;

  @Column({ nullable: true, default: null })
  mfa_code_expires?: Date;

  @Column({ nullable: true, default: null })
  reset_password_expires?: Date;

  @Column({ nullable: true, default: null })
  reset_password_attempts?: number;

  @Column({ nullable: true, default: null })
  reset_password_token?: string;

  @Column({ nullable: true, default: null })
  reset_password_token_expires?: Date;

  @Column({ nullable: true, default: null })
  photo?: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  email_validated?: boolean;

  @Column({ nullable: true, default: null })
  email_hash?: string;

  @Column({ nullable: true, default: null })
  phone?: string;

  @Column({ default: false })
  phone_validated?: boolean;

  @Column({ nullable: true, default: null, type: 'enum', enum: ['PJ', 'PF'] })
  person_type: 'PJ' | 'PF';

  @Column({ nullable: true, default: null })
  indicated_by?: string;

  @Column({ unique: true })
  hash_link?: string;

  @Column({ type: 'jsonb', default: '[]' })
  documents?: {
    type: string;
    value: string;
    validated: boolean;
  }[];

  @Column({ nullable: true })
  cpf?: string;

  @Column({ nullable: true })
  cnpj?: string;

  @Column({ nullable: true })
  rg?: string;

  @Column({ type: 'jsonb', default: '{}' })
  additional_info?: {
    gender?: 'male' | 'female' | 'other';
    birthday?: string;
    instagram?: string;
  };

  @Column({ type: 'jsonb', default: '{}' })
  address?: {
    cep?: string;
    city?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    state?: string;
  };

  @Column({
    type: 'enum',
    enum: ['USER', 'ASSISTENT', 'ADMIN', 'CUSTOMER'],
    default: 'USER',
  })
  account_type?: 'USER' | 'ASSISTENT' | 'ADMIN' | 'CUSTOMER';

  @Column({ default: false })
  blocked_access?: boolean;

  @Column({ default: 1 })
  taxInviting?: number;

  @Column({ default: false })
  documentValidated?: boolean;

  @Column({
    enum: ['NOT_FOUND', 'PENDING', 'APPROVED', 'REJECTED'],
    default: 'NOT_FOUND',
  })
  documentStatus?: 'NOT_FOUND' | 'PENDING' | 'APPROVED' | 'REJECTED';

  @Column({ nullable: true, default: null })
  document_approved_by?: string;

  @Column({ nullable: true, default: null })
  documentReason?: string;

  @Column({ default: 'default' })
  tax_config?: string;

  @Column({ default: '15d' })
  tax_frequency?: `${number}d`;

  @Column({ type: 'float', default: 0 })
  total_revenue?: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  last_revenue_update?: Date;

  @Column({ default: 0 })
  login_attempts?: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  last_login_attempt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @Column({
    type: 'jsonb',
    default: '[]',
  })
  tags?: string[];

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'indicated_by' })
  user_indicated?: Users;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'document_approved_by' })
  admin_approved?: Users;

  @ManyToOne(() => Taxes)
  @JoinColumn({ name: 'tax_config' })
  tax?: Taxes;

  @OneToMany(() => UsersActivity, (activity) => activity.user)
  activity?: UsersActivity[];

  @OneToMany(() => UserSessions, (session) => session.user)
  sessions?: UserSessions[];

  @OneToMany(() => UserOldPasswords, (password) => password.user)
  old_passwords?: UserOldPasswords[];

  @OneToOne(
    () => UsersNotificationsPreferences,
    (preferences) => preferences.user,
  )
  preferences?: UsersNotificationsPreferences;

  @OneToMany(() => Warns, (warn) => warn.user, { nullable: true })
  warns?: Warns[];
}
