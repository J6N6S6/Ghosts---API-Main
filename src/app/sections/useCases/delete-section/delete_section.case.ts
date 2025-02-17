import { PackagesRepository } from '@/domain/repositories/packages.repository';
import { SectionsRepository } from '@/domain/repositories/sections.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
import { Injectable } from '@nestjs/common';
@Injectable()
export class DeleteSectionCase {
  constructor(
    private readonly sectionsRepository: SectionsRepository,
    private readonly packagesRepository: PackagesRepository,
  ) {}

  async execute(sectionId: string, user_id: string): Promise<void> {
    try {
      const section = await this.sectionsRepository.findById(sectionId);

      if (!section) {
        throw new ClientException('Seção não encontrada');
      }

      const packageQuery = await this.packagesRepository.findById(
        section.package_id,
      );

      if (packageQuery.owner_id !== user_id)
        throw new ClientException(
          'Você não tem permissão para editar essa seção',
        );

      await this.sectionsRepository.delete(sectionId);
    } catch (err) {
      if (err instanceof ClientException) throw err;
      throw new ServerException(
        'Erro interno ao fazer essa ação na seção!',
        err,
      );
    }
  }
}
