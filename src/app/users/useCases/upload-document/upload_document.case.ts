import { User } from '@/domain/models/users.model';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';

export interface UploadUserDocumentDTO {
  user_id: string;
  files?: {
    name: string;
    data: Buffer;
    file_details: Express.Multer.File;
  }[];
}

@Injectable()
export class UploadUserDocumentCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute({ user_id, files }: UploadUserDocumentDTO): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ClientException('Usuário não encontrado');
    if (user.documentStatus === 'APPROVED')
      throw new ClientException('Documento já aprovado');
    if (user.documentStatus === 'PENDING')
      throw new ClientException('Documento já enviado para análise');

    const documents = [];

    if (user.documents.length >= 1) {
      for (const file of user.documents) {
        const file_url = file.value;

        await this.uploadService.deleteFile(file_url);
      }
    }

    for (const file of files) {
      const uploadResult = await this.uploadService.uploadFile({
        buffer: file.data,
        filename: file.name,
        location: ['private', 'documents', user_id, 'pending'],
        options: {
          ContentDisposition: `attachment; filename=${this.sanitizeFileName(
            file?.file_details?.originalname,
          )}`,
        },
      });

      documents.push({
        type: file.name.split('.')[1],
        value: uploadResult.url,
        validated: false,
      });
    }

    const userQuery = new User(user);

    userQuery.documents = documents;
    userQuery.documentStatus = 'PENDING';

    await this.usersRepository.update(userQuery);
  }

  sanitizeFileName(fileName: string): string {
    // Substitui espaços por underscores
    let sanitized = fileName.replace(/\s+/g, '_');

    // Remove acentuações
    sanitized = sanitized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Remove caracteres não permitidos em nomes de arquivos
    sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '');

    return sanitized;
  }
}
