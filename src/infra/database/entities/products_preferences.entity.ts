import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Products } from './products.entity';

@Entity('products_preferences')
export class ProductsPreferences {
  @PrimaryColumn()
  id?: string;

  @Column({
    unique: true,
  })
  product_id: string;

  @Column({
    type: 'jsonb',
    default: '[]',
  })
  payment_method?: string[];

  @Column({
    default: false,
  })
  allow_payment_with_two_cards?: boolean;

  @Column({
    default: false,
  })
  repeat_email_in_checkout?: boolean;

  @Column({
    type: 'jsonb',
    default: {
      birthdate: false,
      phone: false,
      address: false,
    },
  })
  inputs_checkout?: {
    birthdate: boolean;
    phone: boolean;
    address: boolean;
  };

  @Column({
    nullable: true,
  })
  upsell_url?: string;

  @Column({
    nullable: true,
  })
  whatsapp_link?: string;

  @Column({
    type: 'jsonb',
    default: {
      enabled: false,
      male_notification: {
        enabled: false,
      },
      female_notification: {
        enabled: false,
      },
      today_notification: {
        enabled: false,
        min: 0,
        max: 0,
      },
      now_notification: {
        enabled: false,
        min: 0,
        max: 0,
      },
    },
  })
  notifications?: {
    enabled: boolean;
    male_notification: {
      enabled: boolean;
    };
    female_notification: {
      enabled: boolean;
    };
    today_notification: {
      enabled: boolean;
      min: number;
      max: number;
    };
    now_notification: {
      enabled: boolean;
      min: number;
      max: number;
    };
  };

  @Column({
    type: 'jsonb',
    default: {
      enabled: false,
      time_minutes: 0,
      text_active: '',
      text_expired: '',
      text_color: '',
      background_color: '',
    },
  })
  countdown?: {
    enabled: boolean;
    time_minutes: number;
    text_active: string;
    text_expired: string;
    text_color: string;
    background_color: string;
  };

  @Column({
    nullable: true,
  })
  back_redirect_url?: string;

  @Column({
    nullable: true,
    default: null,
  })
  color_section?: string;

  @Column({
    type: 'jsonb',
    default: {
      bg_color: '#16a34a',
      text_color: '#ffffff',
      text: 'FINALIZAR PAGAMENTO',
    },
  })
  purchase_button?: {
    bg_color: string;
    text_color: string;
    text: string;
  };

  @Column({
    type: 'jsonb',
    default: '[]',
  })
  orderbumps?: {
    bump_id: string;
    product_link: string | null;
    sell_phrase?: string;
    aux_phrase?: string;
    image: string;
  }[];

  @OneToOne(() => Products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product?: Products;
}
