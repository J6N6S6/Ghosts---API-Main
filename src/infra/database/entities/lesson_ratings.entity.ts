import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Products } from './products.entity';
import { ProductsLessons } from './products_lessons.entity';
import { Users } from './users.entity';

@Entity('lesson_ratings')
export class LessonRatings {
  @PrimaryColumn()
  id?: string;

  @Column()
  user_id: string;

  @Column()
  product_id: string;

  @Column()
  lesson_id: string;

  @Column()
  rating: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product?: Products;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user?: Users;

  @ManyToOne(() => ProductsLessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_id' })
  lesson?: ProductsLessons;
}
