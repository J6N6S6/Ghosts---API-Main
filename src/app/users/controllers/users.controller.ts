import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { HttpResponse } from '@/shared/@types/HttpResponse';
import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../services/users.service';
import { UpdateUserBody } from '../validators/UpdateUser.body';
import { UpdateUserPhoneBody } from '../validators/UpdateUserPhone.body';
import { UpdateUserTaxesBody } from '../validators/update_user_taxes.body';
import { VerifyUserPhoneBody } from '../validators/VerifyUserPhone.body';
import { Throttle } from '@nestjs/throttler';
@Controller('@me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUser(
    @CurrentUser('user_id') user_id: string,
  ): Promise<HttpResponse> {
    const user = await this.usersService.getUser(user_id);

    return {
      hasError: false,
      data: user,
    };
  }

  @Put('update')
  async updateUser(
    @CurrentUser('user_id') user_id: string,
    @Body() data: UpdateUserBody,
  ): Promise<HttpResponse> {
    await this.usersService.updateUser({
      ...data,
      user_id,
    });

    return {
      hasError: false,
      message: 'Dados atualizados com sucesso',
    };
  }

  @Put('update/phone')
  @Throttle(1, 60)
  async updateUserPhone(
    @CurrentUser('user_id') user_id: string,
    @Body() data: UpdateUserPhoneBody,
    @Ip() ip: string,
  ): Promise<HttpResponse> {
    await this.usersService.changeUserPhone({
      ...data,
      user_id,
      ip_address: ip,
    });

    return {
      hasError: false,
      message: 'Código de verificação enviado com sucesso',
    };
  }

  @Post('update/phone/verify')
  @Throttle(5, 60)
  async verifyUserPhone(
    @CurrentUser('user_id') user_id: string,
    @Body() data: VerifyUserPhoneBody,
    @Ip() ip: string,
  ): Promise<HttpResponse> {
    await this.usersService.validateUserPhone({
      ...data,
      user_id,
      ip_address: ip,
    });

    return {
      hasError: false,
      message: 'Telefone validado com sucesso!',
    };
  }

  @Get('identifications')
  async getUserIdentifications(
    @CurrentUser('user_id') user_id: string,
  ): Promise<HttpResponse> {
    const user_data = await this.usersService.getUserIdentity(user_id);

    return {
      hasError: false,
      data: user_data,
    };
  }

  @Get('invites')
  async getUserInvites(
    @CurrentUser('user_id') user_id: string,
  ): Promise<HttpResponse> {
    const invites = await this.usersService.getUserInvites(user_id);

    return {
      hasError: false,
      data: invites,
    };
  }

  @Patch('/image')
  @UseInterceptors(FileInterceptor('image'))
  async updateUserImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('user_id') user_id: string,
  ) {
    if (!file) return { hasError: true, message: 'Nenhum arquivo enviado' };

    const data = await this.usersService.updateUserImage({
      image: file.buffer,
      user_id,
    });

    return {
      hasError: false,
      data,
    };
  }

  @Delete('/image')
  async deleteUserImage(@CurrentUser('user_id') user_id: string) {
    const data = await this.usersService.updateUserImage({
      image: null,
      user_id,
    });

    return {
      hasError: false,
      data,
    };
  }

  @Post('vinculate/invite-code')
  async addInviteCode(
    @CurrentUser('user_id') user_id: string,
    @Body() data: { invite_code: string },
  ) {
    await this.usersService.addInviteCode({
      user_id,
      invite_code: data.invite_code,
    });

    return {
      hasError: false,
      message: 'Código de convite adicionado com sucesso',
    };
  }

  @Get('users-indicated')
  async listUsersIndicated(
    @CurrentUser('user_id') user_id: string,
    @Query() data: { page: number; limit: number },
  ) {
    const page = Number(data.page) || 1;
    const limit = Number(data.limit) || 10;

    const users_indicated = await this.usersService.listUsersIndicated({
      user_id,
      page,
      limit,
    });

    return {
      hasError: false,
      data: users_indicated,
    };
  }

  @Get('document')
  async getUserDocument(
    @CurrentUser('user_id') user_id: string,
  ): Promise<HttpResponse> {
    const document = await this.usersService.getUserDocument(user_id);

    return {
      hasError: false,
      data: document,
    };
  }

  @Post('document')
  @UseInterceptors(FilesInterceptor('document'))
  async uploadUserDocument(
    @CurrentUser('user_id') user_id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('document_type') document_type: string[],
  ) {
    if (!files || files.length === 0)
      return { hasError: true, message: 'Nenhum arquivo enviado' };

    if (files.length > 5)
      return {
        hasError: true,
        message: 'Você só pode enviar no máximo 5 arquivos',
      };

    for (const file of files) {
      if (file.size > 10000000) {
        return {
          hasError: true,
          message: 'O tamanho máximo de cada arquivo é de 10MB',
        };
      }
    }

    await this.usersService.uploadUserDocument({
      user_id,
      files: files.map((file, index) => ({
        name: document_type[index],
        data: file.buffer,
        file_details: file,
      })),
    });

    return {
      hasError: false,
      message: 'Documento enviado com sucesso',
    };
  }

  @Get('taxes')
  async getUserTaxes(
    @CurrentUser('user_id') user_id: string,
  ): Promise<HttpResponse> {
    const taxes = await this.usersService.getUserTaxes(user_id);

    return {
      hasError: false,
      data: taxes,
    };
  }

  @Put('taxes')
  async updateUserTaxes(
    @CurrentUser('user_id') user_id: string,
    @Body() data: UpdateUserTaxesBody,
  ): Promise<HttpResponse> {
    await this.usersService.updateUserTaxes({
      user_id,
      tax_frequency: data.tax_frequency,
    });

    return {
      hasError: false,
      message: 'Dados atualizados com sucesso',
    };
  }
}
