import { Injectable } from '@nestjs/common';
import { CreatePixelDTO } from '../dtos/CreatePixelDTO';
import { UpdatePixelDTO } from '../dtos/UpdatePixelDTO';
import { ChangePixelVisibilityCase } from '../useCases/change-pixel-visibility/change_pixel_visibility.case';
import { CreatePixelCase } from '../useCases/create-pixel/create_pixel.case';
import { DeletePixelCase } from '../useCases/delete-pixel/delete_pixe.case';
import { ListPixelsByProductCase } from '../useCases/list-pixels-by-product/list_pixels_by_product.case';
import { ListPixelsByProductDTO } from '../useCases/list-pixels-by-product/list_pixels_by_product.dto';
import { UpdatePixelCase } from '../useCases/update-pixel/update_pixel.case';

@Injectable()
export class PixelsService {
  constructor(
    private readonly listPixelsByProductCase: ListPixelsByProductCase,
    private readonly updatePixelCase: UpdatePixelCase,
    private readonly createPixelCase: CreatePixelCase,
    private readonly changePixelVisibilityCase: ChangePixelVisibilityCase,
    private readonly deletePixelCase: DeletePixelCase,
  ) {}

  async listPixelsProduct(data: ListPixelsByProductDTO) {
    return this.listPixelsByProductCase.execute(data);
  }

  async createPixel(data: CreatePixelDTO) {
    return this.createPixelCase.execute(data);
  }

  async updatePixel(data: UpdatePixelDTO) {
    return this.updatePixelCase.execute(data);
  }

  async changePixelVisibility(pixel_id: string) {
    return this.changePixelVisibilityCase.execute(pixel_id);
  }

  async deletePixel(pixel_id: string) {
    return this.deletePixelCase.execute(pixel_id);
  }
}
