import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { Controller, Get } from '@nestjs/common';
import { PackagesService } from '../services/packages.service';

@Controller('@me/packages')
export class UserPackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get('/')
  async listUserPackages(@CurrentUser('user_id') user_id: string) {
    const packages = await this.packagesService.listUserPackages(user_id);
    return {
      hasError: false,
      data: packages,
    };
  }
}
