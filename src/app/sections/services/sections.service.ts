import { Sections } from '@/infra/database/entities/sections.entity';
import { Injectable } from '@nestjs/common';
import { CreateSectionDTO } from '../dtos/CreateSectionDTO';
import { UpdateSectionDTO } from '../dtos/UpdateSectionDTO';
import { CreateSectionCase } from '../useCases/create-section/create_section.case';
import { DeleteSectionCase } from '../useCases/delete-section/delete_section.case';
import { ListPackageSectionsCase } from '../useCases/list-package-sections/list_package_sections.case';
import { UpdateSectionCase } from '../useCases/update-section/update_section.case';
@Injectable()
export class SectionsService {
  constructor(
    private readonly listPackageSectionsCase: ListPackageSectionsCase,
    private readonly createSectionCase: CreateSectionCase,
    private readonly updateSectionCase: UpdateSectionCase,
    private readonly deleteSectionCase: DeleteSectionCase,
  ) {}

  async ListPackageSections(packageId: string): Promise<Sections[]> {
    return this.listPackageSectionsCase.execute(packageId);
  }

  async CreateSection(data: CreateSectionDTO) {
    const sections = await this.createSectionCase.execute(data);
    return {
      hasError: false,
      data: sections,
    };
  }

  async UpdateSection(data: UpdateSectionDTO): Promise<any> {
    return await this.updateSectionCase.execute(data);
  }

  async DeleteSection({
    sectionId,
    user_id,
  }: {
    sectionId: string;
    user_id: string;
  }) {
    return this.deleteSectionCase.execute(sectionId, user_id);
  }
}
