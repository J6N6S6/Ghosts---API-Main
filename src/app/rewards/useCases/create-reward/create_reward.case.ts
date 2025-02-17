import { Reward } from '@/domain/models/rewards.model';
import { RewardsRepository } from '@/domain/repositories/rewards.repository';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { CreateRewardDTO } from './create_reward.dto';

@Injectable()
export class CreateRewardCase {
  constructor(
    private readonly rewardsRepository: RewardsRepository,
    private readonly fileService: FileUploadService,
  ) {}

  async execute(data: CreateRewardDTO) {
    let upload_result = null;

    if (data.image) {
      const file_upload_result = await this.fileService.uploadFile({
        buffer: data.image,
        filename: data.title,
        location: ['rewards', 'images'],
      });

      upload_result = file_upload_result.url;
    }

    const reward = new Reward({
      available: data.available,
      delivery_mode: data.delivery_mode,
      description: data.description,
      goal: data.goal,
      image: upload_result,
      title: data.title,
    });

    return await this.rewardsRepository.create(reward);
  }
}
