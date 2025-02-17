import { Injectable } from '@nestjs/common';
import { WarnsRepository } from '@/domain/repositories/warns.repository';

@Injectable()
export class FindWarnByIdCase {
  constructor(private readonly warnsRepository: WarnsRepository) {}

  async execute(id: string) {
    const warn = await this.warnsRepository.findById(id);
    return warn;
  }
}
