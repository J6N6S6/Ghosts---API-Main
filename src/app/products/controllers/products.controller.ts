import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { IsPublic } from '@/app/auth/decorators/endpoint-public.decorator';
import { UserIsProductOwner } from '@/shared/decorators/user-is-product-owner.decorator';
import { ValidateDTO } from '@/shared/decorators/validate-dto.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ProductsService } from '../services/products.service';
import { CreateProductBody } from '../validators/create_product.body';
import { CreateProductOrderbumpBody } from '../validators/create_product_orderbump.body';
import { UpdateProductBody } from '../validators/update_product.body';
import { UpdateProductCheckoutBody } from '../validators/update_product_checkout.body';
import { UpdateGeneralSettingsBody } from '../validators/update_general_settings.body';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'product_content_file', maxCount: 1 },
    ]),
  )
  @HttpCode(201)
  async create(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      product_content_file?: Express.Multer.File[];
    },
    @Body() data: CreateProductBody,
    @CurrentUser('user_id') user_id: string,
  ) {
    const imageFile = files?.image?.[0];
    const contentFile = files?.product_content_file?.[0];

    const product = await this.productsService.createProduct({
      ...data,
      image: imageFile?.buffer || null,
      product_content_file: contentFile || null,
      user_id,
    });

    return {
      hasError: false,
      data: product,
    };
  }

  @Get(':product_id')
  async findProductById(
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    const product = await this.productsService.findProductById(
      product_id,
      user_id,
    );
    return {
      hasError: false,
      data: product,
    };
  }

  @UserIsProductOwner()
  @Patch(':product_id')
  @ValidateDTO(UpdateProductBody)
  async updateProduct(
    @Param('product_id') product_id: string,
    @Body()
    data: UpdateProductBody,
    @CurrentUser('user_id') user_id: string,
  ) {
    await this.productsService.updateProduct({
      ...data,
      product_id,
      user_id,
    });

    return {
      hasError: false,
      message: 'Produto atualizado com sucesso!',
    };
  }

  @UserIsProductOwner()
  @Patch(':product_id/image')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('user_id') user_id: string,
    @Param('product_id') product_id: string,
  ) {
    const data = await this.productsService.updateProductImage({
      image: file.buffer,
      product_id,
      user_id,
    });

    return {
      hasError: false,
      message: 'Produto atualizado com sucesso!',
      data,
    };
  }

  @UserIsProductOwner()
  @Patch(':product_id/banner/:banner_type')
  @UseInterceptors(FileInterceptor('image'))
  async updateBanner(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('user_id') user_id: string,
    @Param('product_id') product_id: string,
    @Param('banner_type') banner_type: 'primary' | 'secondary',
  ) {
    const data = await this.productsService.updateProductBanner({
      banner: file.buffer,
      product_id,
      banner_type,
      user_id,
    });

    return {
      hasError: false,
      message: 'Produto atualizado com sucesso!',
      data,
    };
  }

  @UserIsProductOwner()
  @Delete(':product_id/banner/:banner_type')
  async deleteBanner(
    @CurrentUser('user_id') user_id: string,
    @Param('product_id') product_id: string,
    @Param('banner_type') banner_type: 'primary' | 'secondary',
  ) {
    const data = await this.productsService.updateProductBanner({
      banner: null,
      banner_type,
      product_id,
      user_id,
    });

    return {
      hasError: false,
      message: 'Produto atualizado com sucesso!',
      data,
    };
  }

  @Get('checkout/:product_id')
  async getCheckoutData(
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    const data = await this.productsService.getCheckoutData({
      product_id,
      user_id,
    });

    return {
      hasError: false,
      data,
    };
  }

  @UserIsProductOwner()
  @Put('checkout/:product_id')
  async updateCheckoutData(
    @Param('product_id') product_id: string,
    @Body() data: UpdateProductCheckoutBody,
  ) {
    await this.productsService.updateCheckoutData({
      ...data,
      product_id,
    });

    return {
      hasError: false,
      message: 'Dados de checkout atualizados com sucesso!',
    };
  }

  @UserIsProductOwner()
  @Post('orderbump/:product_id')
  @UseInterceptors(FileInterceptor('image'))
  async addOrderbump(
    @UploadedFile() file: Express.Multer.File,
    @Param('product_id') product_id: string,
    @Body() data: CreateProductOrderbumpBody,
  ) {
    await this.productsService.addProductOrderbump({
      ...data,
      product_id,
      image: file.buffer,
    });

    return {
      hasError: false,
      message: 'Orderbump adicionado com sucesso!',
    };
  }

  @UserIsProductOwner()
  @Put('orderbump/:product_id')
  @UseInterceptors(FileInterceptor('image'))
  async updateOrderbump(
    @UploadedFile() file: Express.Multer.File,
    @Param('product_id') product_id: string,
    @Body() data: CreateProductOrderbumpBody,
  ) {
    await this.productsService.updateProductOrderbump({
      ...data,
      product_id,
      image: file.buffer,
    });

    return {
      hasError: false,
      message: 'Orderbump atualizado com sucesso!',
    };
  }

  @UserIsProductOwner()
  @Delete('orderbump/:product_id/:bump_id')
  async removeOrderbump(
    @Param('product_id') product_id: string,
    @Param('bump_id') bump_id: string,
  ) {
    await this.productsService.removeProductOrderbump({
      bump_id,
      product_id,
    });

    return {
      hasError: false,
      message: 'Orderbump removido com sucesso!',
    };
  }

  @Get(':product_id/orderbumps')
  async listOrderbumps(
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    const orderbumps = await this.productsService.listProductOrderbumps({
      product_id,
      user_id,
    });

    return {
      hasError: false,
      data: orderbumps,
    };
  }

  @Get(':product_id/general-settings')
  @UserIsProductOwner()
  async getGeneralSettings(
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    const settings = await this.productsService.getGeneralSettings({
      product_id,
      user_id,
    });

    return {
      hasError: false,
      data: settings,
    };
  }

  @Put(':product_id/general-settings')
  @UserIsProductOwner()
  async updateGeneralSettings(
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
    @Body() data: UpdateGeneralSettingsBody,
  ) {
    await this.productsService.updateGeneralSettings({
      ...data,
      product_id,
      user_id,
    });

    return {
      hasError: false,
      message: 'Configurações atualizadas com sucesso!',
    };
  }

  @Patch(':product_id/archive')
  @UserIsProductOwner()
  async archiveProduct(@Param('product_id') product_id: string) {
    await this.productsService.archiveProduct(product_id);

    return {
      hasError: false,
      message: 'Produto arquivado com sucesso!',
    };
  }

  @Patch(':product_id/send-to-revision')
  @UserIsProductOwner()
  async sendProductToRevision(@Param('product_id') product_id: string) {
    await this.productsService.sendProductToRevision(product_id);

    return {
      hasError: false,
      message: 'Produto enviado para revisão com sucesso!',
    };
  }
}
