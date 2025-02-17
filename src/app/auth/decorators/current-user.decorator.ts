import { ClientException } from '@/infra/exception/client.exception';
import {
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user.user_id)
      throw new ClientException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    return data ? user && user[data] : user;
  },
);
