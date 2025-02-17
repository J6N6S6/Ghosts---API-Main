import { generateShortId } from '@/app/products/utils/generateShortId';
import { ProductAffiliate } from '@/domain/models/product_affiliate.model';
import {
  ProductsAffiliatesRepository,
  ProductsRepository,
  UsersRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RequestAffiliationDTO } from './request_affiliation.dto';

@Injectable()
export class RequestAffiliationCase {
  constructor(
    private readonly productsAffiliatesRepository: ProductsAffiliatesRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({ user_id, product_id }: RequestAffiliationDTO) {
    const product = await this.productsRepository.findOne({
      where: [
        { id: product_id },
        {
          short_id: product_id,
        },
      ],
      select: [
        'id',
        'allow_affiliate',
        'owner',
        'affiliate_automatically_approve',
        'affiliate_receive_mail',
        'title',
      ],
      relations: ['owner'],
    });

    if (!product) throw new ClientException('Produto não encontrado');
    if (!product.allow_affiliate)
      throw new ClientException('Produto não permite afiliação');
    if (product.owner.id === user_id)
      throw new ClientException(
        'Você não pode solicitar afiliação do seu próprio produto',
      );

    const affiliation = await this.productsAffiliatesRepository.findOne({
      where: { user_id, product_id: product.id },
    });

    if (affiliation) {
      if (affiliation.status === 'PENDING')
        throw new ClientException('Afiliação pendente');
      if (affiliation.status === 'ACCEPTED')
        throw new ClientException('Afiliação já aceita');
      if (affiliation.blocked)
        throw new ClientException(
          'Você não pode solicitar afiliação deste produto',
        );
    }

    let short_id = generateShortId(12);
    let short_id_unique = false;

    while (!short_id_unique) {
      const affiliate = await this.productsAffiliatesRepository.findOne({
        where: { id: short_id },
      });

      if (!affiliate) {
        short_id_unique = true;
      }

      short_id = generateShortId(12);
    }

    const affiliationUser = new ProductAffiliate(
      affiliation || {
        id: short_id,
        user_id,
        product_id: product.id,
      },
    );

    affiliationUser.status = product.affiliate_automatically_approve
      ? 'ACCEPTED'
      : 'PENDING';

    if (affiliation)
      await this.productsAffiliatesRepository.update(affiliationUser);
    else await this.productsAffiliatesRepository.create(affiliationUser);

    if (affiliationUser.status === 'ACCEPTED') {
      const user = await this.usersRepository.findBy({
        where: { id: user_id },
        select: ['id', 'name'],
      });

      this.eventEmitter.emit('mailer.send', {
        template: 'USER_REQUEST_AFFILIATION_APPROVED',
        template_data: {
          affiliate_name: user.name,
          product_name: product.title,
          product_description: product.description,
          product_image: product.image,
        },
        to: {
          address: product.owner.email,
          name: product.owner.name,
        },
      });
    }

    if (!product.affiliate_automatically_approve) {
      const user = await this.usersRepository.findById(user_id);

      this.eventEmitter.emit('notification.send', {
        user_id: product.owner.id,
        body: `O usuário **${user?.name}** solicitou afiliação do produto **${product.title}**`,
        icon: user.photo || 'info',
        action_type: 'AFFILIATION_REQUEST',
        action_data: {
          product_id: product.id,
          affiliation_id: affiliationUser.id,
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

      if (product.affiliate_receive_mail) {
        this.eventEmitter.emit('mailer.send', {
          template: 'USER_REQUEST_AFFILIATION',
          template_data: {
            producer_name: product.owner.name,
            product_name: product.title,
            product_description: product.description,
            affiliate_name: user.name,
            affiliate_email: user.email,
            product_image: product.image,
            affiliate_avatar: user.photo,
          },
          to: {
            address: product.owner.email,
            name: product.owner.name,
          },
        });
      }
    }
  }
}
