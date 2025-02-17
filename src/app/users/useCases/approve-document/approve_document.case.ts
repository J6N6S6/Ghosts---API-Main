import { User } from '@/domain/models/users.model';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApproveDocumentDTO } from './approve_document.dto';

@Injectable()
export class ApproveDocumentCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({ user_id, admin_id }: ApproveDocumentDTO): Promise<any> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ClientException('Usuário não encontrado');

    const usersModel = new User(user);

    if (usersModel.documentStatus !== 'PENDING')
      throw new ClientException('Este usuário não possui documentos pendentes');

    usersModel.documentStatus = 'APPROVED';
    usersModel.documentValidated = true;
    usersModel.document_approved_by = admin_id;

    await this.usersRepository.update(usersModel);

    this.eventEmitter.emit('notification.send', {
      user_id: user_id,
      body: 'Seus documentos foram aprovados, agora você pode acessar todas as funcionalidades da plataforma!',
      icon: 'success',
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
      template: 'PRODUCER_REQUEST_DOCUMENTS_APPROVED',
      template_data: {
        producer_name: user.name,
      },
      to: {
        name: user.name,
        address: user.email,
      },
    });
  }
}
