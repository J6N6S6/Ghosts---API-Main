import { Injectable } from '@nestjs/common';
import { PackagesRepository } from '@/domain/repositories/packages.repository';
import { Packages } from '@/infra/database/entities/packages.entity';
@Injectable()
export class ListPackagesByIdCase {
  constructor(private readonly packagesRepository: PackagesRepository) {}

  async execute(productId: string): Promise<Packages> {
    return this.packagesRepository.findById(productId);
  }
}
