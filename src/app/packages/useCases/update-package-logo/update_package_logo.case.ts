import { PackagesRepository } from '@/domain/repositories/packages.repository';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
@Injectable()
export class UpdatePackageLogoCase {
  constructor(
    private readonly packagesRepository: PackagesRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute(
    logo: Buffer,
    packageId: string,
    user_id: string,
  ): Promise<any> {
    try {
      const pack = await this.packagesRepository.findById(packageId);

      if (!pack) throw new ClientException('Pacote não encontrado');

      if (pack.owner_id !== user_id)
        throw new ClientException(
          'Você não tem permissão para editar esse pacote',
        );

      const uploadResult = await this.uploadService.uploadFile({
        buffer: logo,
        filename: pack.title,
        location: ['packages', 'logo'],
      });
      pack.logo = uploadResult.url;

      await this.packagesRepository.updatePackLogo(pack);

      if (uploadResult && pack.logo)
        try {
          await this.uploadService.deleteFile(pack.logo);
        } catch (err) {
          console.log(err);
        }
      return {
        logo: uploadResult.url,
      };
    } catch (err) {
      if (err instanceof ClientException) throw err;
      throw new ClientException(
        'Erro interno ao fazer essa ação no pacote!',
        err,
      );
    }
  }
}
