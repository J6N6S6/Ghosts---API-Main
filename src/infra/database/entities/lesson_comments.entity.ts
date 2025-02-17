import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { LessonCommentsLikes } from './lesson_comments_likes.entity';
import { ProductsLessons } from './products_lessons.entity';
import { Users } from './users.entity';

@Entity('lesson_comments')
export class LessonComments {
  @PrimaryColumn()
  id?: string;

  @Column({
    nullable: true,
    default: null,
  })
  parent_id?: string;

  @Column()
  user_id: string;

  @Column()
  content: string;

  @Column()
  lesson_id: string;

  @Column({
    default: 0,
  })
  likes_count?: number;

  @Column({
    default: 0,
  })
  dislikes_count?: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  updatedAt?: Date;

  @ManyToOne(() => ProductsLessons, (lesson) => lesson.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lesson_id' })
  lesson?: ProductsLessons;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user?: Users;

  @ManyToOne(() => LessonComments, (comment) => comment.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: LessonComments;

  @OneToMany(() => LessonCommentsLikes, (like) => like.comment)
  likes?: LessonCommentsLikes[];
}
