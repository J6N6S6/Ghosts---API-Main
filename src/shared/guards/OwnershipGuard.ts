import { ProductsService } from '@/app/products/services/products.service';
import { ClientException } from '@/infra/exception/client.exception';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly productService: ProductsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isUserProductOwner = this.reflector.get<boolean>(
      'userIsProductOwner',
      context.getHandler(),
    );

    if (!isUserProductOwner) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const userId = (req.user as any)?.user_id; // Assumindo que o ID do usuário autenticado está disponível em req.user.user_id
    const productId = req.params.product_id || req.body.product_id; // Verifica primeiro nos parâmetros e depois nos parâmetros do corpo

    // Chame o serviço ProductService para verificar a propriedade do produto
    const isOwner = await this.productService.isProductOwner(productId, userId);

    if (isOwner) {
      return true;
    } else {
      throw new ClientException(
        'Você não tem permissão para acessar este recurso',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
