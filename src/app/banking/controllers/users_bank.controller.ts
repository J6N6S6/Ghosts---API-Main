import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsersBankingService } from '../services/users_banking.service';
import { CreateBankAccountBody } from '../validators/create_bank_account.body';
import { UpdateBankAccountBody } from '../validators/update_bank_account.body';

@Controller('@me/banking')
export class UsersBankAccountsController {
  constructor(private readonly userBankingService: UsersBankingService) {}

  @Get()
  async getBankAccountByUserId(@CurrentUser('user_id') user_id: string) {
    const accounts = await this.userBankingService.getUserBankingAccout(
      user_id,
    );

    return {
      hasError: false,
      data: accounts,
    };
  }

  @Post()
  async createBankAccount(
    @CurrentUser('user_id')
    user_id: string,
    @Body() data: CreateBankAccountBody,
  ): Promise<any> {
    await this.userBankingService.createUserBankingAccout({
      ...data,
      user_id,
    });

    return {
      hasError: false,
      message: 'Conta bancária criada com sucesso!',
    };
  }

  @Put(':account_id')
  async updateUserBankAccount(
    @CurrentUser('user_id')
    user_id: string,
    @Body() data: UpdateBankAccountBody,
    @Param('account_id') account_id: string,
  ): Promise<any> {
    await this.userBankingService.updateUserBankingAccout({
      ...data,
      user_id,
      account_id,
    });

    return {
      hasError: false,
      message: 'Conta bancária atualizada com sucesso!',
    };
  }

  @Delete(':account_id')
  async deleteUserBankAccount(
    @CurrentUser('user_id')
    user_id: string,
    @Param('account_id') account_id: string,
  ): Promise<any> {
    await this.userBankingService.deleteUserBankingAccout(user_id, account_id);

    return {
      hasError: false,
      message: 'Conta bancária removida com sucesso!',
    };
  }

  @Throttle(30, 60)
  @Get('balance')
  async getAccountBalance(@CurrentUser('user_id') user_id: string) {
    const balance = await this.userBankingService.getAccountBalance(user_id);

    return {
      hasError: false,
      data: balance,
    };
  }

  @Throttle(3, 60)
  @Get('balance/releases')
  async getPendingBalance(@CurrentUser('user_id') user_id: string) {
    const transactions = await this.userBankingService.getPendingBalance(
      user_id,
    );

    return {
      hasError: false,
      data: transactions,
    };
  }
}
