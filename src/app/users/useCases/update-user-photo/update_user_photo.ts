import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { User } from '@/domain/models/users.model';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
@Injectable()
export class UpdateUserPhotoCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute(
    image: Buffer | null,
    user_id: string,
  ): Promise<{ image: string }> {
    try {
      const user = await this.usersRepository.findById(user_id);

      if (!user) throw new ClientException('Usuário não encontrado');

      const userModel = new User(user);

      if (userModel.photo && !userModel.photo.includes('sunize')) {
        await this.uploadService.deleteFile(userModel.photo);
      }

      if (image !== null) {
        const uploadResult = await this.uploadService.uploadFile({
          buffer: image,
          filename: user.name,
          location: ['users', 'photo'],
        });

        userModel.photo = uploadResult.url;
      } else {
        userModel.photo = null;
      }

      await this.usersRepository.update(userModel);
      return {
        image: userModel.photo,
      };
    } catch (err) {
      console.log('ERRO:', err);
      if (err instanceof ClientException) throw err;
      throw new ServerException('Erro interno ao alterar imagem do usuario!', {
        error: err,
        user_id,
      });
    }
  }
}
