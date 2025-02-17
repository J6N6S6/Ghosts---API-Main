import { PackagesRepository } from '@/domain/repositories/packages.repository';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
@Injectable()
export class UpdatePackageImageCase {
  constructor(
    private readonly packagesRepository: PackagesRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute(
    image: Buffer,
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

      if (pack.image)
        try {
          await this.uploadService.deleteFile(pack.image);
        } catch (err) {
          console.log(err);
        }

      const uploadResult = await this.uploadService.uploadFile({
        buffer: image,
        filename: pack.title,
        location: ['packages', 'image'],
      });
      pack.image = uploadResult.url;

      await this.packagesRepository.updatePackImage(pack);

      return {
        image: uploadResult.url,
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
