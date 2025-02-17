import { ProductsRepository } from '@/domain/repositories/products.repository';
import { Injectable } from '@nestjs/common';
import { UpdateProductDTO } from './update_product.dto';
import { ClientException } from '@/infra/exception/client.exception';
import { Product } from '@/domain/models/product.model';

@Injectable()
export class UpdateProductCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    product_id,
    user_id,
    description,
    payment_type,
    price,
    producer_name,
    product_website,
    support_email,
    title,
    support_phone,
  }: UpdateProductDTO): Promise<void> {
    const findProduct = await this.productsRepository.findById(product_id);

    if (!findProduct) throw new ClientException('Produto não encontrado');
    if (findProduct.owner_id !== user_id)
      throw new ClientException(
        'Você não tem permissão para editar esse produto',
      );

    if (findProduct.status === 'BLOCKED')
      throw new ClientException(
        'Sem permissão para executar essa ação, produto bloqueado!',
      );

    const product = new Product(findProduct);

    if (description) product.description = description;
    if (payment_type) product.payment_type = payment_type;
    if (price) product.price = price;
    if (producer_name) product.producer_name = producer_name;
    if (product_website) product.product_website = product_website;
    if (support_email) product.support_email = support_email;
    if (support_phone) product.support_phone = support_phone;
    if (title) {
      const productExists = await this.productsRepository.findByTitleAndOwnerId(
        user_id,
        title,
      );

      if (productExists && productExists.id !== product_id)
        throw new ClientException('Você já possui um produto com esse nome');

      product.title = title;
    }

    await this.productsRepository.update(product);

    return;
  }
}
