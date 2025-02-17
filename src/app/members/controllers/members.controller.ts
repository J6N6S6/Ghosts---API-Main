import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { ClientException } from '@/infra/exception/client.exception';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { LessonCommentsService } from '../services/lesson_comments.service';
import { MembersService } from '../services/members.service';
import { BlockUserCommentBody } from '../validators/block_user_comment.body';
import { CreateLessonCommentBody } from '../validators/create_lesson_comment.body';
import { LikeLessonCommentBody } from '../validators/like_lesson_comment.body';
import { UpdateLessonCommentBody } from '../validators/update_lesson_comment.body';
import { SaveUserLessonProgressBody } from '../validators/save_user_lesson_progress.body';

@Controller('@members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
    private readonly lessonCommentsService: LessonCommentsService,
  ) {}

  @Get('products/:product_id')
  async getProduct(
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    const product = await this.membersService.getProduct({
      user_id,
      product_id,
    });

    return {
      hasError: false,
      data: product,
    };
  }

  @Get('lessons/:lesson_id')
  async getLesson(
    @Param('lesson_id') lesson_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    const lesson = await this.membersService.getLesson({
      user_id,
      lesson_id,
    });

    return {
      hasError: false,
      data: lesson,
    };
  }

  @Get('products/:product_id/modules')
  async listProductModules(
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
    @Query('lessons') lessons: boolean,
  ) {
    if (!product_id) throw new ClientException('product_id is required');

    const modules = await this.membersService.getProductModules({
      user_id,
      product_id,
      lessons,
    });

    return {
      hasError: false,
      data: modules,
    };
  }

  @Get('products/:product_id/modules/:module_id')
  async getProductModule(
    @Param('product_id') product_id: string,
    @Param('module_id') module_id: string,
    @CurrentUser('user_id') user_id: string,
    @Query('lessons') lessons: boolean,
  ) {
    if (!product_id || !module_id)
      throw new ClientException('product_id and module_id are required');

    const module = await this.membersService.getProductModule({
      user_id,
      product_id,
      module_id,
      lessons,
    });

    return {
      hasError: false,
      data: module,
    };
  }

  @Post('lessons/:lesson_id/ratings')
  async ratingLesson(
    @CurrentUser('user_id') user_id: string,
    @Param('lesson_id') lesson_id: string,
    @Body('rating') rating: number,
  ) {
    await this.membersService.ratingLesson({
      user_id,
      lesson_id,
      rating,
    });

    return {
      hasError: false,
      message: 'Avaliação realizada com sucesso',
    };
  }

  @Get('lessons/:lesson_id/comments')
  async listLessonComments(
    @Param('lesson_id') lesson_id: string,
    @Query()
    query: {
      page: number;
      limit: number;
      filter?: 'most_liked' | 'older' | 'newest' | 'my_comments';
    },
    @CurrentUser('user_id') user_id: string,
  ) {
    if (!query.page || !query.limit)
      throw new ClientException('page and limit are required');

    if (query.limit > 100 || query.limit < 10)
      throw new ClientException('limit must be between 10 and 100');

    const comments = await this.lessonCommentsService.listLessonComments({
      lesson_id,
      page: query.page,
      limit: query.limit,
      user_id,
      filter: query.filter,
    });

    return {
      hasError: false,
      data: comments,
    };
  }

  @Get('lessons/:lesson_id/comments/:parent_id')
  async getLessonComment(
    @Param('lesson_id') lesson_id: string,
    @Param('parent_id') parent_id: string,
    @Query()
    query: {
      page: number;
      limit: number;
      filter?: 'most_liked' | 'older' | 'newest' | 'my_comments';
    },
    @CurrentUser('user_id') user_id: string,
  ) {
    if (!query.page || !query.limit)
      throw new ClientException('page and limit are required');

    if (query.limit > 100 || query.limit < 10)
      throw new ClientException('limit must be between 10 and 100');

    const comment = await this.lessonCommentsService.listLessonComments({
      lesson_id,
      page: query.page,
      limit: query.limit,
      user_id,
      filter: query.filter,
      parent_id,
    });

    return {
      hasError: false,
      data: comment,
    };
  }

  @Post('lessons/:lesson_id/comments')
  async createLessonComment(
    @Param('lesson_id') lesson_id: string,
    @Body() body: CreateLessonCommentBody,
    @CurrentUser('user_id') user_id: string,
  ) {
    if (!body.content) throw new ClientException('content is required');

    await this.lessonCommentsService.createLessonComment({
      lesson_id,
      user_id,
      content: body.content,
      parent_id: body.parent_id,
    });

    return {
      hasError: false,
      message: 'Comentário enviado com sucesso!',
    };
  }

  @Put('lessons/:lesson_id/comments/:comment_id')
  async updateLessonComment(
    @Param('lesson_id') lesson_id: string,
    @Param('comment_id') comment_id: string,
    @Body() body: UpdateLessonCommentBody,
    @CurrentUser('user_id') user_id: string,
  ) {
    await this.lessonCommentsService.updateLessonComment({
      lesson_id,
      user_id,
      content: body.content,
      comment_id,
    });

    return {
      hasError: false,
      message: 'Comentário atualizado com sucesso!',
    };
  }

  @Delete('lessons/:lesson_id/comments/:comment_id')
  async deleteLessonComment(
    @Param('lesson_id') lesson_id: string,
    @Param('comment_id') comment_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    await this.lessonCommentsService.deleteLessonComment({
      comment_id,
      user_id,
      lesson_id,
    });

    return {
      hasError: false,
      message: 'Comentário atualizado com sucesso!',
    };
  }

  @Post('lessons/:lesson_id/comments/:comment_id/like')
  async likeLessonComment(
    @Param('lesson_id') lesson_id: string,
    @Param('comment_id') comment_id: string,
    @CurrentUser('user_id') user_id: string,
    @Body() body: LikeLessonCommentBody,
  ) {
    await this.lessonCommentsService.likeLessonComment({
      lesson_id,
      user_id,
      comment_id,
      like: body.like,
    });

    return {
      hasError: false,
      message: 'Avaliação realizada com sucesso!',
    };
  }

  @Post('lessons/:lesson_id/comments/block-user/:action')
  async blockUserComment(
    @Param('lesson_id') lesson_id: string,
    @Param('action') action: string,
    @CurrentUser('user_id') user_id: string,
    @Body() body: BlockUserCommentBody,
  ) {
    await this.lessonCommentsService.blockUserComment({
      lesson_id,
      user_id,
      block_user_id: body.block_user_id,
      action: action === 'block',
    });

    return {
      hasError: false,
      message: `Usuario ${
        action === 'block' ? 'bloqueado' : 'desbloqueado'
      } com sucesso!`,
    };
  }

  @Post('lessons/:lesson_id/progress')
  async saveUserLessonProgress(
    @Param('lesson_id') lesson_id: string,
    @CurrentUser('user_id') user_id: string,
    @Body() data: SaveUserLessonProgressBody,
  ) {
    await this.membersService.saveUserLessonProgress({
      user_id,
      lesson_id,
      ...data,
    });

    return {
      hasError: false,
      message: 'Progresso salvo com sucesso!',
    };
  }
}
