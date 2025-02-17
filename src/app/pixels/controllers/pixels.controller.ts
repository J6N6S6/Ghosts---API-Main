import { UserIsProductOwner } from '@/shared/decorators/user-is-product-owner.decorator';
import { Body, Controller, Get, Param, Post, Put, Patch } from '@nestjs/common';
import { PixelsService } from '../services/pixels.service';
import { CreatePixelBody } from '../validators/createPixel.body';
import { UpdatePixelBody } from '../validators/updatePixel.body';
import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';

@Controller('products/pixels')
export class PixelsController {
  constructor(private readonly pixelsService: PixelsService) {}

  @Get('list/:product_id')
  async listPixelsProduct(
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    const pixels = await this.pixelsService.listPixelsProduct({
      product_id,
      user_id,
    });

    return {
      hasError: false,
      data: pixels,
    };
  }

  @Post(':product_id')
  async createPixel(
    @Param('product_id') product_id: string,
    @Body() data: CreatePixelBody,
    @CurrentUser('user_id') user_id: string,
  ) {
    await this.pixelsService.createPixel({
      ...data,
      product_id,
      user_id,
    });

    return {
      hasError: false,
      message: 'Pixel criado com sucesso!',
    };
  }

  @Put(':product_id/edit/:pixel_id')
  @UserIsProductOwner()
  async updatePixel(
    @Param('pixel_id') pixel_id: string,
    @Body() data: UpdatePixelBody,
  ) {
    await this.pixelsService.updatePixel({
      ...data,
      pixel_id,
    });

    return {
      hasError: false,
      message: 'Pixel atualizado com sucesso!',
    };
  }

  @Patch(':product_id/active/:pixel_id')
  @UserIsProductOwner()
  async changePixelVisibility(@Param('pixel_id') pixel_id: string) {
    await this.pixelsService.changePixelVisibility(pixel_id);

    return {
      hasError: false,
      message: 'Pixel atualizado com sucesso!',
    };
  }

  @Post(':product_id/delete/:pixel_id')
  @UserIsProductOwner()
  async deletePixel(@Param('pixel_id') pixel_id: string) {
    await this.pixelsService.deletePixel(pixel_id);

    return {
      hasError: false,
      message: 'Pixel deletado com sucesso!',
    };
  }
}
