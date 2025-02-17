import { ProductAffiliate } from '@/domain/models/product_affiliate.model';
import {
  ProductsAffiliatesRepository,
  ProductsRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AffiliationActionControlDTO } from './affiliation_action_control.dto';

@Injectable()
export class AffiliationActionControlCase {
  constructor(
    private readonly productsAffiliatesRepository: ProductsAffiliatesRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('AFFILIATION_REQUEST')
  async execute({
    user_id,
    product_id,
    affiliation_id,
    action,
  }: AffiliationActionControlDTO) {
    const product = await this.productsRepository.findOne({
      where: [
        {
          id: product_id,
          owner_id: user_id,
        },
        {
          id: product_id,
          coproducers: {
            user_id,
          },
        },
      ],
      relations: ['coproducers', 'owner'],
    });

    if (!product) throw new ClientException('Produto não encontrado');

    const affiliation = await this.productsAffiliatesRepository.findOne({
      where: { id: affiliation_id, product_id },
      relations: ['user'],
    });

    if (!affiliation) throw new ClientException('Afiliação não encontrada');

    const affiliationUser = new ProductAffiliate(affiliation);

    switch (action) {
      case 'accept':
        affiliationUser.status = 'ACCEPTED';
        this.eventEmitter.emit('mailer.send', {
          template: 'USER_REQUEST_AFFILIATION_APPROVED',
          template_data: {
            affiliate_name: affiliation.user.name,
            product_name: product.title,
            product_description: product.description,
            product_image: product.image,
          },
          to: {
            address: product.owner.email,
            name: product.owner.name,
          },
        });
        break;
      case 'reject':
        affiliationUser.status = 'REJECTED';
        this.eventEmitter.emit('mailer.send', {
          template: 'USER_REQUEST_AFFILIATION_REJECTED',
          template_data: {
            affiliate_name: affiliation.user.name,
            product_name: product.title,
            product_description: product.description,
            product_image: product.image,
          },
          to: {
            address: product.owner.email,
            name: product.owner.name,
          },
        });
        break;
      case 'block':
        affiliationUser.blocked = true;
        break;
      case 'unblock':
        affiliationUser.blocked = false;
        break;
      case 'block-and-reject':
        affiliationUser.status = 'REJECTED';
        affiliationUser.blocked = true;
        this.eventEmitter.emit('mailer.send', {
          template: 'USER_REQUEST_AFFILIATION_REJECTED',
          template_data: {
            affiliate_name: affiliation.user.name,
            product_name: product.title,
            product_description: product.description,
            product_image: product.image,
          },
          to: {
            address: product.owner.email,
            name: product.owner.name,
          },
        });
        break;
      default:
        throw new ClientException('Status inválido');
    }

    await this.productsAffiliatesRepository.update(affiliationUser);
  }
}
