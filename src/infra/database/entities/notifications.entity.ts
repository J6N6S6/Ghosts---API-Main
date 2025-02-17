import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Notifications {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column()
  body: string;

  @Column({
    default: null,
    nullable: true,
    type: 'jsonb',
  })
  actions?: {
    action: string;
    label: string;
    props?: {
      [key: string]: any;
    };
  }[];

  @Column({
    default: null,
    nullable: true,
    type: 'jsonb',
  })
  action_data?: any;

  @Column({
    default: null,
    nullable: true,
  })
  action_type?: string;

  @Column({
    default: false,
  })
  is_read?: boolean;

  @Column({
    default: false,
  })
  important?: boolean;

  @Column()
  icon: 'info' | 'warning' | 'error' | 'success' | string;

  @Column()
  createdAt?: Date;
}
