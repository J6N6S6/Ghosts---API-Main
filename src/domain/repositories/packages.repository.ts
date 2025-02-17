import { Packages } from '@/infra/database/entities/packages.entity';
import { FindOptionsWhere } from 'typeorm';

export abstract class PackagesRepository {
  abstract create(data: Packages): Promise<Packages>;
  abstract update(data: Packages): Promise<void>;
  abstract updateCustomization(data: Packages): Promise<void>;
  abstract findById(id: string): Promise<Packages>;
  abstract findBy(where: FindOptionsWhere<Packages>): Promise<Packages>;
  abstract findByOwnerId(owner_id: string): Promise<Packages[]>;
  abstract updatePackImage(data: Packages): Promise<void>;
  abstract updatePackBanner(data: Packages): Promise<void>;
  abstract updatePackLogo(data: Packages): Promise<void>;
  // abstract findAll(): Promise<Packages[]>;
}
