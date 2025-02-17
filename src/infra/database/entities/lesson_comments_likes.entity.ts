import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LessonComments } from './lesson_comments.entity';
import { Users } from './users.entity';

@Entity('lesson_comments_likes')
@Index(['user_id', 'comment_id'], { unique: true })
export class LessonCommentsLikes {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id?: number;

  @Column()
  user_id: string;

  // 0 = dislike, 1 = like
  @Column()
  like: number;

  @Column()
  comment_id: string;

  @ManyToOne(() => LessonComments, (comment) => comment.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment?: LessonComments;

  @ManyToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user?: Users;
}
