import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { LessonsService } from '../services/lessons.service';

@Controller('lessons')
export class UserLeassonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post(':lesson_id/rating')
  async ratingLesson(
    @CurrentUser('user_id') user_id: string,
    @Param('lesson_id') lesson_id: string,
    @Body('rating') rating: number,
  ) {
    await this.lessonsService.rating({
      user_id,
      lesson_id,
      rating,
    });

    return {
      hasError: false,
      message: 'Avaliação realizada com sucesso',
    };
  }
}
