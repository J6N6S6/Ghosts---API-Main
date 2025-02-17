import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { PixelsController } from './controllers/pixels.controller';
import { PixelsService } from './services/pixels.service';
import { CreatePixelCase } from './useCases/create-pixel/create_pixel.case';
import { ListPixelsByProductCase } from './useCases/list-pixels-by-product/list_pixels_by_product.case';
import { UpdatePixelCase } from './useCases/update-pixel/update_pixel.case';
import { ChangePixelVisibilityCase } from './useCases/change-pixel-visibility/change_pixel_visibility.case';
import { DeletePixelCase } from './useCases/delete-pixel/delete_pixe.case';

@Module({
  imports: [InfraModule],
  controllers: [PixelsController],
  providers: [
    ListPixelsByProductCase,
    UpdatePixelCase,
    PixelsService,
    CreatePixelCase,
    DeletePixelCase,
    ChangePixelVisibilityCase,
  ],
})
export class PixelsModule {}
