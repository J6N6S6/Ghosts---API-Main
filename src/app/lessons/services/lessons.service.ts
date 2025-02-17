import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RatingLessonCase } from '../../members/useCases/rating-lesson/rating_lesson.case';
import { CreateLessonCase } from '../useCases/create-lesson/create-lesson.case';
import { CreateLessonDTO } from '../useCases/create-lesson/create_lesson.dto';
import { CronVideoStatusCase } from '../useCases/cron-video-status/cron_video_status.case';
import { DeleteLessonCase } from '../useCases/delete-lesson/delete-lesson.case';
import { DeleteLessonDTO } from '../useCases/delete-lesson/delete_lesson.dto';
import { EditLessonCase } from '../useCases/edit-lesson/edit-lesson.case';
import { EditLessonDTO } from '../useCases/edit-lesson/edit_lesson.dto';
import { GetLessonByIdCase } from '../useCases/get-lesson-by-id/get_lesson_by_id.case';
import { GetLessonByIdDTO } from '../useCases/get-lesson-by-id/get_lesson_by_id.dto';
import { GetProductAvgRatingCase } from '../useCases/get-product-avg-rating/get_product_avg_rating.case';
import { GetProductsMostRatingCase } from '../useCases/get-products-most-rating/get_products_most_rating.case';
import { GetProductsMostRatingDTO } from '../useCases/get-products-most-rating/get_products_most_rating.dto';
import { GetVideoUploadProgressCase } from '../useCases/get-video-upload-progress/get_video_upload_progress.case';
import { GetVideoUploadProgressDTO } from '../useCases/get-video-upload-progress/get_video_upload_progress.dto';
import { ListAllLessonsCase } from '../useCases/list-all-lessons/list_all_lessons.case';
import { UpdateAllLessonsPositionCase } from '../useCases/update-all-lessons-position/update-all-lessons-position.case';
import { UpdateAllLessonsPositionDTO } from '../useCases/update-all-lessons-position/update-all-lessons-position.dto';
import { UpdateLessonPositionCase } from '../useCases/update-lesson-position/update-lesson-position.case';
import { UpdateLessonPositionDTO } from '../useCases/update-lesson-position/update-lesson-position.dto';
import { UpdateLessonVideoCase } from '../useCases/update-lesson-video/update_lesson_video.case';
import { UpdateLessonVideoDTO } from '../useCases/update-lesson-video/update_lesson_video.dto';

@Injectable()
export class LessonsService {
  constructor(
    private readonly createLessonCase: CreateLessonCase,
    private readonly editLessonCase: EditLessonCase,
    private readonly deleteLessonCase: DeleteLessonCase,
    private readonly updateLessonPositionCase: UpdateLessonPositionCase,
    private readonly listAllLessonsCase: ListAllLessonsCase,
    private readonly updateAllLessonsPositionCase: UpdateAllLessonsPositionCase,
    private readonly ratingLessonCase: RatingLessonCase,
    private readonly getProductsMostRatingCase: GetProductsMostRatingCase,
    private readonly getProductAvgRatingCase: GetProductAvgRatingCase,
    private readonly getLessonByIdCase: GetLessonByIdCase,
    private readonly updateLessonVideoCase: UpdateLessonVideoCase,
    private readonly getVideoUploadProgressCase: GetVideoUploadProgressCase,
    private readonly cronVideoStatusCase: CronVideoStatusCase,
  ) {}

  async create(data: CreateLessonDTO) {
    return this.createLessonCase.execute(data);
  }

  async delete(data: DeleteLessonDTO) {
    return this.deleteLessonCase.execute(data);
  }

  async updatePosition(data: UpdateLessonPositionDTO) {
    return this.updateLessonPositionCase.execute(data);
  }

  async updateAllLessonsPosition(data: UpdateAllLessonsPositionDTO) {
    return this.updateAllLessonsPositionCase.execute(data);
  }

  async edit(data: EditLessonDTO) {
    return this.editLessonCase.execute(data);
  }

  async list(data: { owner_id: string; product_id: string }) {
    return this.listAllLessonsCase.execute(data);
  }

  async rating(data: { lesson_id: string; rating: number; user_id: string }) {
    return this.ratingLessonCase.execute(data);
  }

  async getProductsMostRating(data: GetProductsMostRatingDTO) {
    return this.getProductsMostRatingCase.execute(data);
  }

  async getProductAvgRating(product_id: string) {
    return this.getProductAvgRatingCase.execute(product_id);
  }

  async getLessonById(data: GetLessonByIdDTO) {
    return this.getLessonByIdCase.execute(data);
  }

  async updateLessonVideo(data: UpdateLessonVideoDTO) {
    return this.updateLessonVideoCase.execute(data);
  }

  async getVideoUploadProgress(data: GetVideoUploadProgressDTO) {
    return this.getVideoUploadProgressCase.execute(data);
  }

  // @Cron('0 */1 * * * *')
  // async checkAllLessonsVideoStatus() {
  //   const logger = new Logger('CheckLessonVideoStatus');
  //   // logger.warn('Checking all lessons video status');
  //   return;
  // }
}
