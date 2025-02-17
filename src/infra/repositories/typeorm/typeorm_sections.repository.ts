import { SectionsRepository } from '@/domain/repositories/sections.repository';
import { Sections } from '@/infra/database/entities/sections.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Section } from '@/domain/models/sections.model';
@Injectable()
export class TypeormSectionsRepository implements SectionsRepository {
  constructor(
    @InjectRepository(Sections)
    private readonly SectionsRepository: Repository<Sections>,
  ) {}

  findById(id: string): Promise<Sections> {
    return this.SectionsRepository.findOneBy({ id });
  }

  create(data: Sections): Promise<Sections> {
    return this.SectionsRepository.save({
      id: data.id,
      title: data.title,
      package_id: data.package_id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  findBy(where: FindOptionsWhere<Sections>): Promise<Sections> {
    return this.SectionsRepository.findOneBy(where);
  }

  findByPackageId(packageId: string): Promise<Sections[]> {
    return this.SectionsRepository.find({
      where: {
        package_id: packageId,
      },
      relations: ['products'],
    });
  }

  async update(data: Section): Promise<void> {
    const section = {
      id: data.id,
      title: data.title,
      package_id: data.package_id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    await this.SectionsRepository.update(
      {
        id: data.id,
      },
      section,
    );
  }

  async delete(id: string): Promise<void> {
    await this.SectionsRepository.delete({
      id,
    });
  }
}
