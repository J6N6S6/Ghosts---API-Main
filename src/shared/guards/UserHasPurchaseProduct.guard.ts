import { PurchasesService } from '@/app/purchases/services/purchases.service';
import { ClientException } from '@/infra/exception/client.exception';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class UserHasPurchaseProduct implements CanActivate {
  constructor(private readonly purchasesService: PurchasesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = (req.user as any)?.user_id;
    const productId = req.params.product_id || req.body.product_id;

    const isPurchase = await this.purchasesService.userHasPurchased(
      userId,
      productId,
    );

    if (isPurchase) {
      return true;
    } else {
      throw new ClientException(
        'Você não tem permissão para acessar este recurso',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
