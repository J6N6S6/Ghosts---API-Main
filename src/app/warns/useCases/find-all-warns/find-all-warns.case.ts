import { Injectable } from '@nestjs/common';
import { WarnsRepository } from '@/domain/repositories/warns.repository';

@Injectable()
export class FindAllWarnsCase {
  constructor(private readonly warnsRepository: WarnsRepository) {}

  async execute() {
    const warns = await this.warnsRepository.findAll();
    return warns;
  }
}
