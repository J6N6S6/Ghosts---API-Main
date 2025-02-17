import { AppModule } from './../../../app.module';
import { ProductsLinkService } from '@/app/products_link/services/products_link.service';
import { Product } from '@/domain/models/product.model';
import { ProductPreferences } from '@/domain/models/product_preferences.model';
import { Purchase } from '@/domain/models/purchases.model';
import { CategoriesRepository } from '@/domain/repositories/categories.repository';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsPreferencesRepository } from '@/domain/repositories/products_preferences.repository';
import { PurchasesRepository } from '@/domain/repositories/purchases.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { Products } from '@/infra/database/entities/products.entity';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { ClientException } from '@/infra/exception/client.exception';
import { generateShortId } from '../../utils/generateShortId';
import { CreateProductDTO } from './create_product.dto';
import { ProductContentModel } from '@/domain/models/product_content.model';
import { IEProductsContentRepository } from '@/domain/repositories/products_content.repository';

@Injectable()
export class CreateProductCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly uploadService: FileUploadService,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly purchasesRepository: PurchasesRepository,
    private readonly productsPreferencesRepository: ProductsPreferencesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly productsLinkService: ProductsLinkService,
    private readonly productContentRepository: IEProductsContentRepository,
  ) {}

  async execute({
    category_id,
    description,
    image,
    product_type,
    price,
    title,
    user_id,
    payment_type,
    producer_name,
    product_website,
    support_email,
    members_area,
    support_phone,
    product_content_file,
    product_content_link,
  }: CreateProductDTO): Promise<Products> {
    if (!image) throw new ClientException('Imagem do produto é obrigatória');
    const category = await this.categoriesRepository.findById(category_id);

    if (!category) throw new ClientException('Categoria não encontrada');

    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new ClientException('Usuário não encontrado');

    if (!user.cpf && !user.cnpj) {
      throw new ClientException(
        'Você precisa preencher todos os dados pessoais para criar um produto',
      );
    }
    if (user.documentStatus !== 'APPROVED')
      throw new ClientException(
        'Você precisa ter seus documentos aprovados para criar um produto',
      );

    if (members_area === 'EXTERNAL') {
      if (!product_content_file && !product_content_link) {
        throw new ClientException(
          'Você precisa adicionar um conteúdo ao produto',
        );
      }
    }

    try {
      const productExists = await this.productsRepository.findByTitleAndOwnerId(
        user_id,
        title,
      );

      if (productExists)
        throw new ClientException('Você já possui um produto com esse nome');

      let uploadResult: null | string = null;

      if (image) {
        try {
          const result = await this.uploadService.uploadFile({
            buffer: image,
            filename: title,
            location: ['products', 'images'],
          });

          uploadResult = result.url;
        } catch (err) {
          console.log(err);
        }
      }

      let short_id = generateShortId();
      let short_id_unique = false;

      while (!short_id_unique) {
        const product = await this.productsRepository.findByShortId(short_id);

        if (!product) {
          short_id_unique = true;
        }

        short_id = generateShortId();
      }

      const product = new Product({
        category_id,
        title,
        description,
        owner_id: user_id,
        image: uploadResult,
        product_type,
        sale_disabled: true,
        payment_type,
        producer_name,
        product_website,
        support_email,
        members_area,
        short_id,
        status: 'APPROVED',
        price: Number(price),
        support_phone,
      });

      const product_data = await this.productsRepository.create(product);

      let contentFileUploadResult: null | string = null;

      if (members_area === 'EXTERNAL') {
        if (product_content_file && !product_content_link) {
          try {
            const result = await this.uploadService.uploadFile({
              buffer: product_content_file.buffer,
              filename: title,
              location: ['products', 'content'],
              options: {
                ContentDisposition: `attachment; filename=${this.sanitizeFileName(
                  product_content_file?.originalname,
                )}`,
              },
            });
            contentFileUploadResult = result.url;
            const product_content = new ProductContentModel({
              content: contentFileUploadResult,
              type: 'FILE',
              file_details: {
                name: this.sanitizeFileName(product_content_file.originalname),
                size: product_content_file.size,
                type: product_content_file.mimetype,
              },
              product_id: product_data.id,
              title: 'Link do conteúdo',
            });
            const productContentCretated =
              await this.productContentRepository.create(product_content);
            product_data.content = productContentCretated;
            await this.productsRepository.update(new Product(product_data));
          } catch (err) {
            console.log(err);
          }
        }

        if (product_content_link && !product_content_file) {
          const product_content = new ProductContentModel({
            content: product_content_link,
            type: 'LINK',
            file_details: null,
            product_id: product_data.id,
            title: 'Link do conteúdo',
          });

          const productContentCretated =
            await this.productContentRepository.create(product_content);
          product_data.content = productContentCretated;
          await this.productsRepository.update(new Product(product_data));
        }
      }

      const PurchaseUser = new Purchase({
        product_id: product_data.id,
        user_id,
      });

      await this.purchasesRepository.create(PurchaseUser);
      await this.productsPreferencesRepository.create(
        new ProductPreferences({
          product_id: product_data.id,
          payment_method: ['PIX'],
        }),
      );
      await this.productsLinkService.createProductLink({
        product_id: product_data.id,
        title: 'Checkout',
        type: 'CHECKOUT',
        price,
      });

      return product_data;
    } catch (err) {
      console.log(err);
      if (err instanceof ClientException) throw err;
      throw new ClientException('Erro ao criar produto', err);
    }
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
