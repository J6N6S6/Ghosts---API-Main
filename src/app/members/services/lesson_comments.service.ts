import { Injectable } from '@nestjs/common';
import { BlockUserCommentCase } from '../useCases/lesson_comments/block-user-comment/block_user_comment.case';
import { BlockUserCommentDto } from '../useCases/lesson_comments/block-user-comment/block_user_comment.dto';
import { CreateLessonCommentCase } from '../useCases/lesson_comments/create-lesson-comment/create_lesson_comment.case';
import { CreateLessonCommentDto } from '../useCases/lesson_comments/create-lesson-comment/create_lesson_comment.dto';
import { DeleteLessonCommentCase } from '../useCases/lesson_comments/delete-lesson-comment/delete_lesson_comment.case';
import { DeleteLessonCommentDto } from '../useCases/lesson_comments/delete-lesson-comment/delete_lesson_comment.dto';
import { ListLessonCommentsCase } from '../useCases/lesson_comments/list-lesson-comments/list_lesson_comments.case';
import { ListLessonCommentsDto } from '../useCases/lesson_comments/list-lesson-comments/list_lesson_comments.dto';
import { UpdateLessonCommentCase } from '../useCases/lesson_comments/update-lesson-comment/update_lesson_comment.case';
import { UpdateLessonCommentDto } from '../useCases/lesson_comments/update-lesson-comment/update_lesson_comment.dto';
import { LikeLessonCommentCase } from '../useCases/lesson_comments/like-lesson-comment/like_lesson_comment.case';
import { likeLessonCommentDto } from '../useCases/lesson_comments/like-lesson-comment/like_lesson_comment.dto';

@Injectable()
export class LessonCommentsService {
  constructor(
    private readonly createLessonCommentCase: CreateLessonCommentCase,
    private readonly updateLessonCommentCase: UpdateLessonCommentCase,
    private readonly deleteLessonCommentCase: DeleteLessonCommentCase,
    private readonly listLessonCommentsCase: ListLessonCommentsCase,
    private readonly blockUserCommentCase: BlockUserCommentCase,
    private readonly likeLessonCommentCase: LikeLessonCommentCase,
  ) {}

  createLessonComment(data: CreateLessonCommentDto) {
    return this.createLessonCommentCase.execute(data);
  }

  updateLessonComment(data: UpdateLessonCommentDto) {
    return this.updateLessonCommentCase.execute(data);
  }

  deleteLessonComment(data: DeleteLessonCommentDto) {
    return this.deleteLessonCommentCase.execute(data);
  }

  listLessonComments(data: ListLessonCommentsDto) {
    return this.listLessonCommentsCase.execute(data);
  }

  blockUserComment(data: BlockUserCommentDto) {
    return this.blockUserCommentCase.execute(data);
  }

  likeLessonComment(data: likeLessonCommentDto) {
    return this.likeLessonCommentCase.execute(data);
  }
}
