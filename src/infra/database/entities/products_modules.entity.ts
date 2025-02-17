import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Products } from './products.entity';
import { ProductsLessons } from './products_lessons.entity';

@Entity('products_modules')
export class ProductsModules {
  @PrimaryColumn()
  id?: string;

  @Column()
  product_id: string;

  @Column()
  title: string;

  @Column()
  show_title: boolean;

  @Column()
  position: number;

  @Column({ default: null, nullable: true })
  image?: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id' })
  product?: Products;

  @OneToMany(() => ProductsLessons, (lesson) => lesson.module)
  lessons?: ProductsLessons[];
}
