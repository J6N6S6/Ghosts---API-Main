import { Injectable } from '@nestjs/common';
import { PackagesRepository } from '@/domain/repositories/packages.repository';
import { Package } from '@/domain/models/packages.model';
import { CreatePackageDTO } from '../../dtos/CreatePackageDTO';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { ClientException } from '@/infra/exception/client.exception';
import { Packages } from '@/infra/database/entities/packages.entity';
@Injectable()
export class CreatePackageCase {
  constructor(
    private readonly packagesRepository: PackagesRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute({
    title,
    description,
    owner_id,
    image,
  }: CreatePackageDTO): Promise<Packages> {
    try {
      const uploadResult = await this.uploadService.uploadFile({
        buffer: image,
        filename: title,
        location: ['modules', 'images'],
      });

      const modules = new Package({
        title: title,
        description: description,
        owner_id: owner_id,
        image: uploadResult.url,
      });

      return await this.packagesRepository.create(modules);
    } catch (err) {
      if (err instanceof ClientException) throw err;
      throw new ClientException('Erro interno ao criar o pacote!', err);
    }
  }
}
