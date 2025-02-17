import { User } from '@/domain/models/users.model';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeclineDocumentDTO } from './decline_document.dto';

@Injectable()
export class DeclineDocumentCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly fileUploadService: FileUploadService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({
    user_id,
    admin_id,
    reason,
  }: DeclineDocumentDTO): Promise<any> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ClientException('Usuário não encontrado');

    const userModel = new User(user);

    if (userModel.documentStatus !== 'PENDING')
      throw new ClientException('Este usuário não possui documentos pendentes');

    try {
      for (const file of userModel.documents) {
        await this.fileUploadService.deleteFile(file.value);
      }
    } catch (error) {
      console.log(error);
    }

    userModel.documentStatus = 'REJECTED';
    userModel.documentReason = reason || null;
    userModel.documentValidated = false;
    userModel.document_approved_by = admin_id;
    userModel.documents = [];

    await this.usersRepository.update(userModel);

    this.eventEmitter.emit('notification.send', {
      user_id: user_id,
      body: `Seus documentos foram reprovados${
        (reason && ' pelo motivo "' + reason + '"') || ''
      }, por favor, envie novamente!/`,
      icon: 'error',
      actions: [
        {
          label: 'Acessar',
          action: 'redirect:DOCUMENTS_PAGE',
          props: {
            button_type: 'redirect',
          },
        },
      ],
    });

    this.eventEmitter.emit('mailer.send', {
      template: 'PRODUCER_REQUEST_DOCUMENTS_REJECTED',
      template_data: {
        producer_name: user.name,
        reason: reason || 'Não informado',
      },
      to: {
        name: user.name,
        address: user.email,
      },
    });
  }
}
