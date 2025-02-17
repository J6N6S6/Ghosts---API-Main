import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { MembersController } from './controllers/members.controller';
import { LessonCommentsService } from './services/lesson_comments.service';
import { MembersService } from './services/members.service';
import { GetLessonCase } from './useCases/get-lesson/get_lesson.case';
import { GetProductModuleCase } from './useCases/get-product-module/get_product_module.case';
import { GetProductModulesCase } from './useCases/get-product-modules/get_product_modules.case';
import { GetProductCase } from './useCases/get-product/get_product.case';
import { BlockUserCommentCase } from './useCases/lesson_comments/block-user-comment/block_user_comment.case';
import { CreateLessonCommentCase } from './useCases/lesson_comments/create-lesson-comment/create_lesson_comment.case';
import { DeleteLessonCommentCase } from './useCases/lesson_comments/delete-lesson-comment/delete_lesson_comment.case';
import { LikeLessonCommentCase } from './useCases/lesson_comments/like-lesson-comment/like_lesson_comment.case';
import { ListLessonCommentsCase } from './useCases/lesson_comments/list-lesson-comments/list_lesson_comments.case';
import { UpdateLessonCommentCase } from './useCases/lesson_comments/update-lesson-comment/update_lesson_comment.case';
import { RatingLessonCase } from './useCases/rating-lesson/rating_lesson.case';
import { SaveUserLessonProgressCase } from './useCases/save-user-lesson-progress/save_user_lesson_progress.case';
@Module({
  imports: [InfraModule],
  providers: [
    CreateLessonCommentCase,
    UpdateLessonCommentCase,
    DeleteLessonCommentCase,
    ListLessonCommentsCase,
    BlockUserCommentCase,
    LikeLessonCommentCase,

    GetProductModulesCase,
    GetProductModuleCase,
    GetProductCase,
    GetLessonCase,
    RatingLessonCase,

    SaveUserLessonProgressCase,

    LessonCommentsService,
    MembersService,
  ],
  controllers: [MembersController],
  exports: [LessonCommentsService],
})
export class MembersModule {}
