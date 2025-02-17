import { HttpResponse } from '@/shared/@types/HttpResponse';
import { Body, Controller, Ip, Post } from '@nestjs/common';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthService } from '../services/auth.service';
import { ChangePasswordBody } from '../validators/change_password.body';

@Controller('@me/auth')
export class UserAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('changepass')
  async changePassword(
    @Body() data: ChangePasswordBody,
    @Ip() ip_address: string,
    @CurrentUser()
    user: {
      user_id: string;
      secret?: string;
    },
  ): Promise<HttpResponse> {
    await this.authService.changePassword({
      ...data,
      ip_address,
      user_id: user.user_id,
      session_secret: user.secret,
    });

    return {
      hasError: false,
      message: 'Senha alterada com sucesso, faça login novamente.',
    };
  }
}
