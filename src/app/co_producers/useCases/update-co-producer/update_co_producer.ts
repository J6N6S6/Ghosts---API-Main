import { CoProducer } from '@/domain/models/co_producer.model';
import { CoProducersRepository } from '@/domain/repositories/co_producers.repository';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { UpdateCoProducerDTO } from './update_co_producer.dto';
import { ProductsService } from '@/app/products/services/products.service';

@Injectable()
export class UpdateCoProducerCase {
  constructor(
    private readonly coProducersRepository: CoProducersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly productsService: ProductsService,
  ) {}

  async execute({
    producer_id,
    co_producer_id,
    product_id,
    commission,
    commission_order_bump,
  }: UpdateCoProducerDTO) {
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
      throw new ClientException('Esse co-produtor não existe!');
    }

    const coProducer = new CoProducer(findCoProducer);

    if (commission) {
      const commissionTotal = await this.productsService.verifyTotalCommission(
        product_id,
      );

      const oldCommissions = commissionTotal - coProducer.commission;

      if (oldCommissions + commission > 80)
        throw new ClientException(
          'Comissão total não pode ser maior que 80%, verifique as comissões dos co-produtores e afiliados',
        );

      coProducer.commission = commission;
    }
    if (commission_order_bump)
      coProducer.commission_orderbump = commission_order_bump;

    await this.coProducersRepository.update(coProducer);
  }
}
