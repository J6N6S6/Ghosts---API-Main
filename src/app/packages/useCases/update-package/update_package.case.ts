import { Injectable } from '@nestjs/common';
import { PackagesRepository } from '@/domain/repositories/packages.repository';
import { Package } from '@/domain/models/packages.model';
import { UpdatePackageDTO } from '../../dtos/UpdatePackageDTO';
import { ClientException } from '@/infra/exception/client.exception';
@Injectable()
export class UpdatePackageCase {
  constructor(private readonly packagesRepository: PackagesRepository) {}

  async execute(data: UpdatePackageDTO): Promise<any> {
    try {
      const findPack = await this.packagesRepository.findById(data.packageId);
      if (!findPack) throw new ClientException('Pacote não encontrado');

      if (findPack.owner_id !== data.user_id)
        throw new ClientException(
          'Você não tem permissão para editar esse pacote',
        );
      const pack = new Package(findPack);

      const packages = new Package({
        id: pack.id,
        owner_id: pack.owner_id,
        title: data.title ? data.title : pack.title,
        description: data.description ? data.description : pack.description,
      });

      await this.packagesRepository.update(packages);
    } catch (err) {
      if (err instanceof ClientException) throw err;
      throw new ClientException(
        'Erro interno ao fazer essa ação no pacote!',
        err,
      );
    }
  }
}
