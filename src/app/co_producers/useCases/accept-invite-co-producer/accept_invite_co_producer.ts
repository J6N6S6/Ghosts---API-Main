import { CoProducer } from '@/domain/models/co_producer.model';
import { CoProducersRepository } from '@/domain/repositories/co_producers.repository';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AcceptInviteCoProducerDTO } from './accept_invite_co_producer.dto';

@Injectable()
export class AcceptInviteCoProducerCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly coProducersRepository: CoProducersRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('CO_PRODUCER_INVITE')
  async execute({
    user_id,
    product_id,
    accepted,
    notification_id,
  }: AcceptInviteCoProducerDTO) {
    const product = await this.productsRepository.findOne({
      where: {
        id: product_id,
      },
      relations: ['owner'],
    });

    if (!product) throw new ClientException('Produto não encontrado');
    if (product.status === 'BLOCKED')
      throw new ClientException(
        'Sem permissão para executar essa ação, produto bloqueado!',
      );

    const findCoProducer = await this.coProducersRepository.findBy({
      user_id,
      product_id,
    });

    if (!findCoProducer) {
      throw new ClientException(
        'Você não possui um convite para esse produto!',
      );
    }

    const coProducer = new CoProducer(findCoProducer);

    if (coProducer.accepted) {
      throw new ClientException('Você já aceitou esse convite!');
    }

    const user = await this.usersRepository.findById(user_id);

    if (notification_id) {
      this.eventEmitter.emit('notification.delete', {
        notification_id,
        user_id,
      });
    }

    if (!accepted) {
      await this.coProducersRepository.deleteById(coProducer.id);
      this.eventEmitter.emit('notification.send', {
        user_id: product.owner_id,
        notification_type: null,
        body: `O usuário **${user?.name}** recusou seu convite para ser co-produtor do produto **${product?.title}**`,
        icon: 'error',
      });

      // this.eventEmitter.emit('mailer.send', {
      //   template: 'PRODUCER_REQUEST_COPRODUCTION_REJECTED',
      //   template_data: {
      //     coproducer_name: user.name,
      //     producer_name: product.owner.name,
      //     product_name: product.title,
      //     product_description: product.description,
      //     product_image: product.image,
      //   },
      //   to: {
      //     name: user.name,
      //     address: user.email,
      //   },
      // });

      return;
    }

    coProducer.accepted = true;
    coProducer.joinedAt = new Date();

    await this.coProducersRepository.update(coProducer);

    this.eventEmitter.emit('notification.send', {
      user_id: product.owner_id,
      notification_type: null,
      body: `O usuário **${user?.name}** aceitou seu convite para ser co-produtor do produto **${product?.title}**`,
      icon: 'success',
    });

    this.eventEmitter.emit('mailer.send', {
      template: 'PRODUCER_REQUEST_COPRODUCTION_APPROVED',
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

    return coProducer;
  }
}
