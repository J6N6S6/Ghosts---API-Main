import { SendProductToRevisionCase } from './../useCases/send-product-to-revision/send-product-to-revision';
import { Products } from '@/infra/database/entities/products.entity';
import { ProductsPreferences } from '@/infra/database/entities/products_preferences.entity';
import { Injectable } from '@nestjs/common';
import { updateCheckoutDataDTO } from '../dtos/UpdateCheckoutDataDTO';
import { AddProductOrderbumpCase } from '../useCases/add-product-orderbump/add_product_orderbump.case';
import { AddProductOrderbumpDTO } from '../useCases/add-product-orderbump/add_product_orderbump.dto';
import { AdminChangeProductStatusCase } from '../useCases/admin-change-product-status/admin_change_product_status.case';
import { AdminChangeProductStatusDTO } from '../useCases/admin-change-product-status/admin_change_product_status.dto';
import { AdminProductsControlCase } from '../useCases/admin-products-control/admin_products_control.case';
import { AdminProductsControlDTO } from '../useCases/admin-products-control/admin_products_control.dto';
import { ArchiveProductCase } from '../useCases/archive-product/archive-product.case';
import { CreateProductCase } from '../useCases/create-product/create_product.case';
import { CreateProductDTO } from '../useCases/create-product/create_product.dto';
import { FindProductByIdCase } from '../useCases/find-product-by-id/find_product_by_id.case';
import { FindProductByShortIdCase } from '../useCases/find-product-by-short-id/find_product_by_short_id.case';
import { GetGeneralSettingsCase } from '../useCases/get-general-settings/get_general_settings.case';
import { GetGeneralSettingsDTO } from '../useCases/get-general-settings/get_general_settings.dto';
import { GetProductCheckoutCase } from '../useCases/get-product-checkout/get_product_checkout.case';
import { GetProductCheckoutDTO } from '../useCases/get-product-checkout/get_product_checkout.dto';
import { GetUserProductCase } from '../useCases/get-user-product/get_user_product.case';
import { ListProductOrderbumpsCase } from '../useCases/list-product-orderbumps/list_product_orderbumps.case';
import { ListProductOrderbumpsDTO } from '../useCases/list-product-orderbumps/list_product_orderbumps.dto';
import { ListProductStudentsCase } from '../useCases/list-product-students/list_product_students.case';
import { ListProductStudentsDTO } from '../useCases/list-product-students/list_product_students.dto';
import { ListUserProductsCase } from '../useCases/list-user-products/list_user_products.case';
import { RemoveProductOrderbumpCase } from '../useCases/remove-product-orderbump/remove_product_orderbump.case';
import { RemoveProductOrderbumpDTO } from '../useCases/remove-product-orderbump/remove_product_orderbump.dto';
import { UpdateGeneralSettingsCase } from '../useCases/update-general-settings/update_general_settings.case';
import { UpdateGeneralSettingsDTO } from '../useCases/update-general-settings/update_general_settings.dto';
import { UpdateProductBannerCase } from '../useCases/update-product-banner/update_product_banner.case';
import { UpdateProductBannerDTO } from '../useCases/update-product-banner/update_product_banner.dto';
import { UpdateProductCheckoutCase } from '../useCases/update-product-checkout/update_product_checkout.case';
import { UpdateProductImageCase } from '../useCases/update-product-image/update_product_image.case';
import { UpdateProductImageDTO } from '../useCases/update-product-image/update_product_image.dto';
import { UpdateProductOrderbumpCase } from '../useCases/update-product-orderbump/update_product_orderbump.case';
import { UpdateProductOrderbumpDTO } from '../useCases/update-product-orderbump/update_product_orderbump.dto';
import { UpdateProductCase } from '../useCases/update-product/update_product.case';
import { UpdateProductDTO } from '../useCases/update-product/update_product.dto';
import { VerifyTotalCommissionCase } from '../useCases/verify-total-commission/verify_total_commission.case';
import { AdminUpdateProductPaymentMethodsDTO } from '../dtos/AdminUpdateProductPaymentMethods.DTO';
import { AdminUpdateProductPaymentMethodsCase } from '../useCases/admin-update-product-payment-methods/admin_update_product_payment_methods.case';

@Injectable()
export class ProductsService {
  constructor(
    private readonly createProductCase: CreateProductCase,
    private readonly listUserProductsCase: ListUserProductsCase,
    private readonly findProductByIdCase: FindProductByIdCase,
    private readonly updateProductCase: UpdateProductCase,
    private readonly updateProductImageCase: UpdateProductImageCase,
    private readonly updateProductBannerCase: UpdateProductBannerCase,
    private readonly getProductCheckoutCase: GetProductCheckoutCase,
    private readonly updateProductCheckoutCase: UpdateProductCheckoutCase,
    private readonly findProductByShortIdCase: FindProductByShortIdCase,
    private readonly addProductOrderbumpCase: AddProductOrderbumpCase,
    private readonly updateProductOrderbumpCase: UpdateProductOrderbumpCase,
    private readonly removeProductOrderbumpCase: RemoveProductOrderbumpCase,
    private readonly listProductOrderbumpsCase: ListProductOrderbumpsCase,
    private readonly updateGeneralSettingsCase: UpdateGeneralSettingsCase,
    private readonly getGeneralSettingsCase: GetGeneralSettingsCase,
    private readonly verifyTotalCommissionCase: VerifyTotalCommissionCase,
    private readonly getUserProductCase: GetUserProductCase,
    private readonly listProductStudentsCase: ListProductStudentsCase,
    private readonly archiveProductCase: ArchiveProductCase,
    private readonly sendProductToRevisionCase: SendProductToRevisionCase,
    private readonly adminProductsControlCase: AdminProductsControlCase,
    private readonly adminChangeProductStatusCase: AdminChangeProductStatusCase,
    private readonly adminUpdateProductPaymentMethodsCase: AdminUpdateProductPaymentMethodsCase,
  ) {}

  async isProductOwner(product_id: string, user_id: string): Promise<boolean> {
    const product = await this.findProductByIdCase.execute(product_id);

    if (product.owner_id === user_id) {
      return true;
    }

    return false;
  }

  async createProduct(data: CreateProductDTO): Promise<Products> {
    return this.createProductCase.execute(data);
  }

  async listUserProducts(user_id: string) {
    return this.listUserProductsCase.execute(user_id);
  }

  async findProductById(
    product_id: string,
    user_id?: string,
  ): Promise<Products> {
    return this.findProductByIdCase.execute(product_id, user_id);
  }

  async updateProduct(data: UpdateProductDTO): Promise<void> {
    return this.updateProductCase.execute(data);
  }

  async updateProductImage(data: UpdateProductImageDTO): Promise<{
    image: string;
  }> {
    return this.updateProductImageCase.execute(data);
  }

  async updateProductBanner(data: UpdateProductBannerDTO): Promise<void> {
    return this.updateProductBannerCase.execute(data);
  }

  async getCheckoutData(
    data: GetProductCheckoutDTO,
  ): Promise<ProductsPreferences> {
    return this.getProductCheckoutCase.execute(data);
  }

  async updateCheckoutData(data: updateCheckoutDataDTO): Promise<void> {
    await this.updateProductCheckoutCase.execute(data);
  }

  async getProductCheckoutByShortId(short_id: string): Promise<Products> {
    return this.findProductByShortIdCase.execute(short_id);
  }

  async addProductOrderbump(data: AddProductOrderbumpDTO): Promise<void> {
    await this.addProductOrderbumpCase.execute(data);
  }

  async updateProductOrderbump(data: UpdateProductOrderbumpDTO): Promise<void> {
    await this.updateProductOrderbumpCase.execute(data);
  }

  async removeProductOrderbump(data: RemoveProductOrderbumpDTO): Promise<void> {
    await this.removeProductOrderbumpCase.execute(data);
  }

  async listProductOrderbumps(data: ListProductOrderbumpsDTO): Promise<any> {
    return this.listProductOrderbumpsCase.execute(data);
  }

  async updateGeneralSettings(data: UpdateGeneralSettingsDTO): Promise<void> {
    return this.updateGeneralSettingsCase.execute(data);
  }

  async getGeneralSettings(data: GetGeneralSettingsDTO) {
    return this.getGeneralSettingsCase.execute(data);
  }

  async verifyTotalCommission(product_id: string) {
    return this.verifyTotalCommissionCase.execute(product_id);
  }

  async getUserProduct(data: any) {
    return this.getUserProductCase.execute(data);
  }

  async listProductStudents(data: ListProductStudentsDTO) {
    return this.listProductStudentsCase.execute(data);
  }

  async archiveProduct(product_id: string) {
    return this.archiveProductCase.execute(product_id);
  }

  async sendProductToRevision(product_id: string) {
    return this.sendProductToRevisionCase.execute(product_id);
  }

  async adminProductsControl(data: AdminProductsControlDTO) {
    return this.adminProductsControlCase.execute(data);
  }

  async adminChangeProductStatus(data: AdminChangeProductStatusDTO) {
    return this.adminChangeProductStatusCase.execute(data);
  }

  async adminUpdateProductPaymentMethods(
    data: AdminUpdateProductPaymentMethodsDTO,
  ) {
    return this.adminUpdateProductPaymentMethodsCase.execute(data);
  }
}
