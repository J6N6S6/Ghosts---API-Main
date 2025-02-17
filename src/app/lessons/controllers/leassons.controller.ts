import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { ClientException } from '@/infra/exception/client.exception';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { LessonsService } from '../services/lessons.service';
import { CreateLessonBody } from '../validators/createLesson.body';
import { EditLessonBody } from '../validators/editLesson.body';
import { EditLessonsPositionBody } from '../validators/editLessonsPosition.body';

import * as fs from 'fs/promises';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products/:product_id/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  async listAllLessons(
    @CurrentUser('user_id') owner_id: string,
    @Param('product_id') product_id: string,
  ) {
    const lessons = await this.lessonsService.list({
      owner_id,
      product_id,
    });

    return {
      hasError: false,
      data: lessons,
    };
  }

  @Get(':lesson_id')
  async getLessonById(
    @CurrentUser('user_id') owner_id: string,
    @Param('product_id') product_id: string,
    @Param('lesson_id') lesson_id: string,
  ) {
    const lesson = await this.lessonsService.getLessonById({
      owner_id,
      product_id,
      lesson_id,
    });

    return {
      hasError: false,
      data: lesson,
    };
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'background', maxCount: 1 },
      { name: 'materials', maxCount: 10 },
    ]),
  )
  async createLesson(
    @CurrentUser('user_id') owner_id: string,
    @Param('product_id') product_id: string,
    @Body() body: CreateLessonBody,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File;
      background?: Express.Multer.File[];
      materials?: Express.Multer.File[];
    },
  ) {
    const thumbnailFormatted = files.thumbnail;
    const backgroundFormatted = files.background?.[0];
    const materials_formated = files.materials?.map((material) => {
      return {
        title: material.originalname,
        type: 'file' as any,
        content: material.buffer,
        file_details: material.buffer
          ? {
              name: material.originalname,
              size: material.size,
              type: material.mimetype,
            }
          : null,
      };
    });

    const lesson = await this.lessonsService.create({
      ...body,
      owner_id,
      product_id,
      thumbnail: thumbnailFormatted?.buffer || undefined,
      materials: materials_formated,
      background: backgroundFormatted?.buffer || undefined,
    });

    return {
      hasError: false,
      message: 'Aula criada com sucesso',
      data: lesson,
    };
  }

  @Put(':lesson_id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'background', maxCount: 1 },
      { name: 'materials', maxCount: 10 },
    ]),
  )
  async editLesson(
    @CurrentUser('user_id') owner_id: string,
    @Param('product_id') product_id: string,
    @Param('lesson_id') lesson_id: string,
    @Body() body: EditLessonBody,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File;
      background?: Express.Multer.File[];
      materials?: Express.Multer.File[];
    },
  ) {
    const thumbnailFormatted = files.thumbnail;
    const backgroundFormatted = files.background?.[0];
    const materials_formated = files.materials?.map((material) => {
      return {
        title: material.originalname,
        type: 'file' as any,
        content: material.buffer,
        file_details: material.buffer
          ? {
              name: material.originalname,
              size: material.size,
              type: material.mimetype,
            }
          : null,
      };
    });
    const updatedLesson = await this.lessonsService.edit({
      ...body,
      owner_id,
      product_id,
      lesson_id,
      thumbnail: thumbnailFormatted?.buffer || undefined,
      background: backgroundFormatted?.buffer || undefined,
      materials: materials_formated,
      delete_materials: body.delete_materials
        ? JSON.parse(String(body.delete_materials))
        : [],
    });

    return {
      hasError: false,
      message: 'Aula editada com sucesso',
      data: updatedLesson,
    };
  }

  @Get(':lesson_id/video/progress')
  async getProgressVideoUpload(
    @CurrentUser('user_id') user_id: string,
    @Param('product_id') product_id: string,
    @Param('lesson_id') lesson_id: string,
  ) {
    const data = await this.lessonsService.getVideoUploadProgress({
      user_id,
      product_id,
      lesson_id,
    });

    return {
      hasError: false,
      data,
    };
  }

  @Put(':lesson_id/video')
  @UseInterceptors(
    FileInterceptor('video', {
      limits: {
        fileSize: 1000 * 1024 * 1024 * 5, //  5GB
      },
      storage: diskStorage({
        destination: './tmp/uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async editLessonVideo(
    @CurrentUser('user_id') user_id: string,
    @Param('product_id') product_id: string,
    @Param('lesson_id') lesson_id: string,
    @Body('video_url') video_url?: string,
    @UploadedFile()
    video?: Express.Multer.File,
  ) {
    try {
      if (video && !video.path) {
        throw new ClientException('Arquivo inválido');
      }

      await this.lessonsService.updateLessonVideo({
        user_id,
        product_id,
        lesson_id,
        video_type: video ? 'FILE' : 'URL',
        video: video ? video : video_url,
      });

      return {
        hasError: false,
        message: 'Aula editada com sucesso',
      };
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      if (video) {
        await fs.unlink(video.path);
      }
    }
  }

  @Delete(':lesson_id')
  async deleteLesson(
    @CurrentUser('user_id') owner_id: string,
    @Param('lesson_id') lesson_id: string,
  ) {
    await this.lessonsService.delete({
      owner_id,
      lesson_id,
    });

    return {
      hasError: false,
      message: 'Aula deletada com sucesso',
    };
  }

  @Patch('/:lesson_id/position')
  async UpdateLessonPosition(
    @Body('position') position: number,
    @Param('lesson_id') lesson_id: string,
    @CurrentUser('user_id') user_id: string,
  ): Promise<any> {
    await this.lessonsService.updatePosition({
      lesson_id,
      position,
      owner_id: user_id,
    });

    return {
      hasError: false,
      message: 'Posição da aula atualizada com sucesso',
    };
  }

  @Patch('/positions')
  async UpdateLessonsPosition(
    @Body() data: EditLessonsPositionBody,
    @CurrentUser('user_id') user_id: string,
  ): Promise<any> {
    await this.lessonsService.updateAllLessonsPosition({
      owner_id: user_id,
      lessons: data.lessons,
    });

    return {
      hasError: false,
      message: 'Posição das aulas atualizada com sucesso',
    };
  }
}
