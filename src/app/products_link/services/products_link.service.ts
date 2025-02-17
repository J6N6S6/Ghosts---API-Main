import { ProductsLinks } from '@/infra/database/entities/products_links.entity';
import { Injectable } from '@nestjs/common';
import { ChangeProductLinkCase } from '../useCases/change-product-link/change_product_link.case';
import { CreateProductLinkCase } from '../useCases/create-product-link/create_product_link.case';
import { CreateProductLinkDTO } from '../useCases/create-product-link/create_product_link.dto';
import { ListProductLinksCase } from '../useCases/list-product-links/list_product_links.case';
import { DeleteProductLinkCase } from '../useCases/delete-product-link/delete_product_link.case';
import { UpdateProductLinkCase } from '../useCases/update-product-link/update_product_link.case';
import { UpdateProductLinkDTO } from '../useCases/update-product-link/update_product_link.dto';
import { ListProductLinksDTO } from '../useCases/list-product-links/list_product_links.dto';
import { ChangeProductLinkAffiliateCase } from '../useCases/change-product-link-affiliate/change_product_link.case';

@Injectable()
export class ProductsLinkService {
  constructor(
    private readonly createProductLinkCase: CreateProductLinkCase,
    private readonly listProductLinksCase: ListProductLinksCase,
    private readonly changeProductLinkCase: ChangeProductLinkCase,
    private readonly deleteProductLinkCase: DeleteProductLinkCase,
    private readonly updateProductLinkCase: UpdateProductLinkCase,
    private readonly changeProductLinkAffiliateCase: ChangeProductLinkAffiliateCase,
  ) {}

  createProductLink(data: CreateProductLinkDTO): Promise<ProductsLinks> {
    return this.createProductLinkCase.execute(data);
  }

  async updateProductLink(data: UpdateProductLinkDTO): Promise<void> {
    await this.updateProductLinkCase.execute(data);
  }

  listProductLinks(data: ListProductLinksDTO): Promise<ProductsLinks[]> {
    return this.listProductLinksCase.execute(data);
  }

  async changeProductLink(link_id: string): Promise<void> {
    await this.changeProductLinkCase.execute(link_id);
  }

  async deleteProductLink(link_id: string): Promise<void> {
    await this.deleteProductLinkCase.execute(link_id);
  }

  async changeProductLinkAffiliate(link_id: string): Promise<void> {
    await this.changeProductLinkAffiliateCase.execute(link_id);
  }
}
