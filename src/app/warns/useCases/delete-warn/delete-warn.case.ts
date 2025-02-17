import { Injectable } from '@nestjs/common';
import { WarnsRepository } from '@/domain/repositories/warns.repository';

@Injectable()
export class DeleteWarnCase {
  constructor(private readonly warnsRepository: WarnsRepository) {}

  async execute(id: string) {
    await this.warnsRepository.delete(id);
  }
}
