import { Injectable } from '@nestjs/common';
import { SectionsRepository } from '@/domain/repositories/sections.repository';
import { Sections } from '@/infra/database/entities/sections.entity';
@Injectable()
export class ListPackageSectionsCase {
  constructor(private readonly sectionsRepository: SectionsRepository) {}

  async execute(packageId: string): Promise<Sections[]> {
    return this.sectionsRepository.findByPackageId(packageId);
  }
}
