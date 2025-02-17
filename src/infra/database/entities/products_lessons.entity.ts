import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Products } from './products.entity';
import { ProductsModules } from './products_modules.entity';
import { ProductsMaterials } from './products_materials.entity';

@Entity('products_lessons')
export class ProductsLessons {
  @PrimaryColumn()
  id?: string;

  @Column()
  module_id: string;

  @Column()
  product_id: string;

  @Column()
  title: string;

  @Column({
    default: null,
    nullable: true,
  })
  description?: string;

  @Column({
    default: null,
    nullable: true,
  })
  thumbnail?: string;

  @Column({
    default: null,
    nullable: true,
  })
  video_url?: string;

  @Column({
    default: false,
  })
  video_internal?: boolean;

  @Column({
    default: 'SUCCESS',
  })
  video_status?: string;

  @Column({
    default: 0,
  })
  duration?: number;

  @Column({
    default: null,
    nullable: true,
  })
  background?: string;

  @Column()
  draft: boolean;

  @Column()
  comments: boolean;

  @Column({
    enum: ['immediate', 'programmed'],
  })
  availability: string;

  @Column({
    enum: ['scheduled', 'timer'],
    default: null,
    nullable: true,
  })
  availability_type?: string;

  @Column({
    default: null,
    nullable: true,
  })
  availability_date?: Date; // datetime

  @Column({
    default: null,
    nullable: true,
  })
  availability_days?: number;

  @Column()
  position: number;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @ManyToOne(() => ProductsModules)
  @JoinColumn({ name: 'module_id' })
  module?: ProductsModules;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id' })
  product?: Products;

  @OneToMany(() => ProductsMaterials, (materials) => materials.lesson)
  materials?: ProductsMaterials[];
}
