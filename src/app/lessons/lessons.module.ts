import { InfraModule } from '@/infra/infra.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RatingLessonCase } from '../members/useCases/rating-lesson/rating_lesson.case';
import { LessonsController } from './controllers/leassons.controller';
import { UserLeassonsController } from './controllers/user_leassons.controller';
import { LessonsService } from './services/lessons.service';
import { VideoService } from './services/video.service';
import { CreateLessonCase } from './useCases/create-lesson/create-lesson.case';
import { CronVideoStatusCase } from './useCases/cron-video-status/cron_video_status.case';
import { DeleteLessonCase } from './useCases/delete-lesson/delete-lesson.case';
import { EditLessonCase } from './useCases/edit-lesson/edit-lesson.case';
import { GetLessonByIdCase } from './useCases/get-lesson-by-id/get_lesson_by_id.case';
import { GetProductAvgRatingCase } from './useCases/get-product-avg-rating/get_product_avg_rating.case';
import { GetProductsMostRatingCase } from './useCases/get-products-most-rating/get_products_most_rating.case';
import { GetVideoUploadProgressCase } from './useCases/get-video-upload-progress/get_video_upload_progress.case';
import { ListAllLessonsCase } from './useCases/list-all-lessons/list_all_lessons.case';
import { UpdateAllLessonsPositionCase } from './useCases/update-all-lessons-position/update-all-lessons-position.case';
import { UpdateLessonPositionCase } from './useCases/update-lesson-position/update-lesson-position.case';
import { UpdateLessonVideoCase } from './useCases/update-lesson-video/update_lesson_video.case';

@Module({
  imports: [InfraModule, ConfigModule, HttpModule],
  controllers: [LessonsController, UserLeassonsController],
  providers: [
    CreateLessonCase,
    DeleteLessonCase,
    UpdateLessonPositionCase,
    EditLessonCase,
    ListAllLessonsCase,
    RatingLessonCase,
    UpdateAllLessonsPositionCase,
    GetProductsMostRatingCase,
    GetProductAvgRatingCase,
    GetLessonByIdCase,
    LessonsService,
    VideoService,
    UpdateLessonVideoCase,
    GetVideoUploadProgressCase,
    CronVideoStatusCase,
  ],
  exports: [LessonsService],
})
export class LessonsModule {}
