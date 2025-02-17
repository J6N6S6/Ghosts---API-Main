import { Injectable } from '@nestjs/common';
import { PackagesRepository } from '@/domain/repositories/packages.repository';
import { Packages } from '@/infra/database/entities/packages.entity';
@Injectable()
export class ListUserPackagesCase {
  constructor(private readonly packagesRepository: PackagesRepository) {}

  async execute(ownerId: string): Promise<Packages[]> {
    return this.packagesRepository.findByOwnerId(ownerId);
  }
}
