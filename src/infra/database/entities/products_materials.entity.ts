import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Products } from './products.entity';
import { ProductsLessons } from './products_lessons.entity';

@Entity('products_materials')
export class ProductsMaterials {
  @PrimaryColumn()
  id?: string;

  @Column()
  product_id: string;

  @Column()
  lesson_id: string;

  @Column()
  title: string;

  @Column({
    enum: ['link', 'file'],
  })
  type: string;

  @Column()
  content: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    default: null,
  })
  file_details: {
    name: string;
    size: number;
    type: string;
  } | null;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id' })
  product?: Products;

  @ManyToOne(() => ProductsLessons)
  @JoinColumn({ name: 'lesson_id' })
  lesson?: ProductsLessons;
}
