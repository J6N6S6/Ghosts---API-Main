import { NotificationsRepository } from '@/domain/repositories';
import { CoProducersRepository } from '@/domain/repositories/co_producers.repository';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RemoveCoProducerDTO } from './remove_co_producer.dto';

@Injectable()
export class RemoveCoProducerCase {
  constructor(
    private readonly coProducersRepository: CoProducersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly notificationsRepository: NotificationsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({
    producer_id,
    co_producer_id,
    product_id,
  }: RemoveCoProducerDTO) {
    const product = await this.productsRepository.findById(product_id);

    if (!product) throw new ClientException('Produto não encontrado');
    if (product.owner_id !== producer_id)
      throw new ClientException('Você não possui permissão para fazer isso!');
    if (product.status === 'BLOCKED')
      throw new ClientException(
        'Sem permissão para executar essa ação, produto bloqueado!',
      );

    const findCoProducer = await this.coProducersRepository.findBy({
      user_id: co_producer_id,
      product_id,
    });

    if (!findCoProducer) {
      throw new ClientException(
        'Esse usuário não é co-produtor desse produto!',
      );
    }

    await this.coProducersRepository.deleteById(findCoProducer.id);

    const notification = await this.notificationsRepository.findOne({
      where: {
        user_id: co_producer_id,
        action_type: 'CO_PRODUCER_INVITE',
        action_data: {
          product_id,
          producer_id,
        },
      },
    });

    if (notification) {
      this.eventEmitter.emit('notification.delete', {
        user_id: co_producer_id,
        notification_id: notification.id,
      });
    }
  }
}
