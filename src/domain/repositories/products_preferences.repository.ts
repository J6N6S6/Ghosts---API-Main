import { ProductPreferences } from '@/domain/models/product_preferences.model';
import { ProductsPreferences } from '@/infra/database/entities/products_preferences.entity';

export abstract class ProductsPreferencesRepository {
  abstract create(product: ProductPreferences): Promise<ProductsPreferences>;
  abstract update(product: ProductPreferences): Promise<void>;
  abstract findByProductId(product_id: string): Promise<ProductsPreferences>;
}
