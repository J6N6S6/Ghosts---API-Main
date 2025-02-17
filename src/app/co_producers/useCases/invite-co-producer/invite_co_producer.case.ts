import { ProductsService } from '@/app/products/services/products.service';
import { CoProducer } from '@/domain/models/co_producer.model';
import { CoProducersRepository } from '@/domain/repositories/co_producers.repository';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IInviteCoProducerDTO } from './invite_co_producer.dto';

@Injectable()
export class InviteCoProducerCase {
  constructor(
    private readonly coProducerRepository: CoProducersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly productsService: ProductsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({
    co_producer_email,
    commission,
    commission_order_bump,
    producer_id,
    product_id,
  }: IInviteCoProducerDTO): Promise<void> {
    try {
      const product = await this.productsRepository.findOne({
        where: {
          id: product_id,
        },
        relations: ['owner'],
      });

      if (!product) throw new ClientException('Produto não encontrado');
      if (product.owner_id !== producer_id)
        throw new ClientException('Você não possui permissão para fazer isso!');

      if (product.status === 'BLOCKED')
        throw new ClientException(
          'Sem permissão para executar essa ação, produto bloqueado!',
        );

      const user = await this.usersRepository.findByEmail(co_producer_email);

      if (!user) throw new ClientException('Usuário não encontrado');
      if (user.documentStatus !== 'APPROVED')
        throw new ClientException(
          'Usuário não disponível para ser co-produtor',
        );

      if (user.id === producer_id)
        throw new ClientException(
          'Você não pode convidar você mesmo para ser co-produtor',
        );

      const findCoProd = await this.coProducerRepository.findBy({
        user_id: user.id,
        product_id: product_id,
      });

      if (findCoProd)
        throw new ClientException(
          findCoProd.accepted
            ? 'Usuário já é co-produtor'
            : 'Aguarde a resposta do usuário',
        );

      const commissionTotal = await this.productsService.verifyTotalCommission(
        product_id,
      );

      if (commissionTotal + commission > 80)
        throw new ClientException(
          'Comissão total não pode ser maior que 80%, verifique as comissões dos co-produtores e afiliados',
        );

      const coProducer = new CoProducer({
        user_id: user.id,
        product_id,
        commission,
        commission_orderbump: commission_order_bump,
        accepted: false,
      });

      await this.coProducerRepository.create(coProducer);

      this.eventEmitter.emit('notification.send', {
        user_id: user.id,
        notification_type: null,
        body: `Você foi convidado para ser co-produtor do produto **${product.title}**`,
        icon: 'info',
        action_type: 'CO_PRODUCER_INVITE',
        action_data: {
          product_id: product.id,
          producer_id: product.owner_id,
        },
        actions: [
          {
            action: 'accept',
            label: 'Aceitar',
            props: {
              button_type: 'confirm',
            },
          },
          {
            action: 'reject',
            label: 'Rejeitar',
            props: {
              button_type: 'reject',
            },
          },
        ],
      });

      this.eventEmitter.emit('mailer.send', {
        template: 'PRODUCER_REQUEST_COPRODUCTION',
        template_data: {
          coproducer_name: user.name,
          producer_name: product.owner.name,
          product_name: product.title,
          product_description: product.description,
          product_image: product.image,
        },
        to: {
          name: user.name,
          address: user.email,
        },
      });
    } catch (error) {
      if (error instanceof ClientException) throw error;
      throw new ClientException(error.message);
    }
  }
}
