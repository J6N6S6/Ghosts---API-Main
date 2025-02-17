import { Sections } from '@/infra/database/entities/sections.entity';
import { FindOptionsWhere } from 'typeorm';

export abstract class SectionsRepository {
  abstract create(data: Sections): Promise<Sections>;
  abstract update(data: Sections): Promise<void>;
  abstract findById(id: string): Promise<Sections>;
  abstract findBy(where: FindOptionsWhere<Sections>): Promise<Sections>;
  abstract findByPackageId(packageId: string): Promise<Sections[]>;
  abstract delete(id: string): Promise<void>;
}
