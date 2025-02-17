import { Injectable } from '@nestjs/common';
import { PackagesRepository } from '@/domain/repositories/packages.repository';
import { Package } from '@/domain/models/packages.model';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { ClientException } from '@/infra/exception/client.exception';
import { UpdatePackageCustomizationDTO } from '../../dtos/UpdatePackageCustomizationDTO';
@Injectable()
export class UpdatePackageCustomizationCase {
  constructor(
    private readonly packagesRepository: PackagesRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute({
    contact,
    favicon,
    background_color,
    color_header,
    package_id,
    user_id,
  }: UpdatePackageCustomizationDTO): Promise<any> {
    try {
      const pack = await this.packagesRepository.findById(package_id);
      if (!pack) throw new ClientException('Pacote não encontrado');

      if (pack.owner_id !== user_id)
        throw new ClientException(
          'Você não tem permissão para editar esse pacote',
        );

      let uploadResult;
      if (favicon) {
        uploadResult = await this.uploadService.uploadFile({
          buffer: favicon,
          filename: pack.title,
          location: ['packages', 'favicon'],
        });
      }
      const packages = new Package(pack);
      if (contact) packages.contact = contact;
      if (background_color) packages.background_color = background_color;
      if (color_header) packages.color_header = color_header;
      if (uploadResult) packages.favicon = uploadResult.url;

      await this.packagesRepository.updateCustomization(packages);

      if (uploadResult && pack.favicon)
        try {
          await this.uploadService.deleteFile(pack.image);
        } catch (err) {
          console.log(err);
        }
    } catch (err) {
      if (err instanceof ClientException) throw err;
      throw new ClientException(
        'Erro interno ao fazer essa ação no pacote!',
        err,
      );
    }
  }
}
