import { ProductsCurrency } from '@/shared/@types/products/products.type';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Categories } from './categories.entity';
import { Packages } from './packages.entity';
import { ProductsLessons } from './products_lessons.entity';
import { ProductsPreferences } from './products_preferences.entity';
import { Sections } from './sections.entity';
import { Users } from './users.entity';
import { CoProducers } from './co_producers.entity';
import { ProductsLinks } from './products_links.entity';
import { ProductsAffiliates } from './products_affiliates.entity';
import { ProductsContentEntity } from './products_content.entity';

@Entity('products')
export class Products {
  @PrimaryColumn()
  id?: string;

  @Column({
    unique: true,
  })
  short_id: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  primary_banner?: string;

  @Column({ nullable: true })
  secondary_banner?: string;

  @Column({ default: '' })
  support_email: string;

  @Column({ default: '' })
  support_phone?: string;

  @Column({ default: '' })
  producer_name: string;

  @Column({ default: '' })
  product_website: string;

  @Column()
  owner_id: string;

  @Column()
  category_id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 'BRL' })
  currency?: ProductsCurrency;

  @Column({ default: true })
  sale_disabled: boolean;

  @Column({ nullable: true, default: null })
  sectionsId?: number;

  @Column({ type: 'float' })
  price: number;

  @Column()
  product_type: 'EBOOK' | 'ONLINE_COURSE' | 'LIVE_MENTORING' | 'FILES';

  @Column({ default: 'ONE_TIME' })
  payment_type: 'ONE_TIME' | 'SUBSCRIPTION';

  @Column({ default: 'IN_PRODUCTION' })
  status?:
    | 'IN_PRODUCTION'
    | 'IN_UPDATE'
    | 'IN_REVIEW'
    | 'ARCHIVED'
    | 'BLOCKED'
    | 'APPROVED'
    | 'REJECTED';

  @Column({
    enum: ['EXTERNAL', 'INTERNAL', 'CHECKOUT_ONLY'],
    default: 'INTERNAL',
  })
  members_area: 'EXTERNAL' | 'INTERNAL' | 'CHECKOUT_ONLY';

  @Column({ nullable: true, default: null })
  status_reason?: string;

  @Column({ default: null, nullable: true })
  gateway?: string;

  @Column({ nullable: true, default: null })
  package_id?: string;

  @Column({ nullable: true, default: null })
  section_id?: string;

  @Column({ default: true })
  allow_product?: boolean;

  @Column({ default: false })
  allow_affiliate?: boolean;

  @Column({ default: false })
  allow_marketplace?: boolean;

  @Column({ default: '' })
  marketplace_support_email?: string;

  @Column({ default: '' })
  marketplace_description?: string;

  @Column({ default: null, nullable: true })
  marketplace_checkout_link?: string;

  @Column({ default: null, nullable: true })
  affiliate_commission?: number;

  @Column({ default: null, nullable: true })
  affiliate_commission_orderbump?: number;

  @Column({ default: false })
  affiliate_automatically_approve?: boolean;

  @Column({ default: false })
  affiliate_receive_mail?: boolean;

  @Column({ default: 'LAST_CLICK' })
  affiliate_assignment?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'owner_id' })
  owner?: Users;

  @ManyToOne(() => Categories)
  @JoinColumn({ name: 'category_id' })
  category?: Categories;

  @ManyToOne(() => Packages)
  @JoinColumn({ name: 'package_id' })
  package?: Packages;

  @ManyToOne(() => Sections, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'section_id' })
  section?: Sections;

  @OneToMany(() => ProductsLessons, (lesson) => lesson.product)
  lessons?: ProductsLessons[];

  @OneToOne(() => ProductsPreferences, (preferences) => preferences.product, {
    cascade: true,
  })
  preferences?: ProductsPreferences;

  @OneToMany(() => CoProducers, (coproducer) => coproducer.product)
  coproducers?: CoProducers[];

  @ManyToOne(() => ProductsLinks, (link) => link.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'marketplace_checkout_link' })
  marketplace_link?: ProductsLinks;

  @OneToMany(() => ProductsLinks, (link) => link.product)
  links?: ProductsLinks[];

  @OneToMany(() => ProductsAffiliates, (affiliate) => affiliate.product)
  affiliates?: ProductsAffiliates[];

  @OneToOne(() => ProductsContentEntity, (content) => content.product, {
    cascade: true,
    onDelete: 'SET NULL', // Atualizado para SET NULL, pois a relação é opcional.
    nullable: true,
  })
  @JoinColumn({ name: 'content_id' })
  content?: ProductsContentEntity;
}
