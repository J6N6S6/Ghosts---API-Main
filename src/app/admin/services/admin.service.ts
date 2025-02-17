import { LoginAsAnotherUserDTO } from './../useCases/login-as-another-user/login_as_another_user.dtos';
import { LoginAsAnotherUserCase } from './../useCases/login-as-another-user/login_as_another_user.case';
import { ChangeAdquirentCase } from './../useCases/change-adquirent/change_adquirent.case';
import { GetAvailablesAdquirentsCase } from '../useCases/get-availables-adquirents/get_availables_adquirents.case';
import { GetCurrentAdquirentsCase } from './../useCases/get-current-adquirents/get_current_adquirents.case';
import { Injectable, Logger } from '@nestjs/common';
import { ChangeAdquirentDTO } from '../dtos/ChangeAdquirentDTO';
import { CreateTaxeCase } from '../useCases/create-taxe/create-taxe.case';
import { CreateTaxeDTO } from '../dtos/CreateTaxeDTO';
import { UpdateTaxeCase } from '../useCases/update-taxe/update-taxe.case';
import { GetTaxesCase } from '../useCases/get-taxes/get-taxes.case';
import { GetUsersCase } from '../useCases/get-users/get-users.case';
import { GetAllUsersQueryDTO } from '../dtos/GetAllUsersQueryDTO';
import { Update } from 'aws-sdk/clients/dynamodb';
import { UpdateUserTaxeBody } from '../validators/updateUserTaxe.body';
import { UpdateUserTaxeCase } from '../useCases/update-user-taxe/update-user-taxe.case';
import { UpdateUserTaxeDTO } from '../dtos/UpdateUserTaxeDTO';
import { GetTaxeCase } from '../useCases/get-taxe/get-taxe.case';
import { GetAccountBalanceCase } from '@/app/banking/useCases/get-account-balance/get_account_balance.case';
import { GetUserBalanceCase } from '../useCases/get-user-balance/get-user-banalance.case';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { GetUserMetricsCase } from '../useCases/get-user-metrics/get-user-metrics.case';
import { ToggleUserStatusCase } from '../useCases/toggle-user-status/toggle_user_status.case';

@Injectable()
export class AdminService {
  constructor(
    private readonly getCurrentAdquirentsCase: GetCurrentAdquirentsCase,
    private readonly getAvailablesAdquirentsCase: GetAvailablesAdquirentsCase,
    private readonly changeAdquirentCase: ChangeAdquirentCase,
    private readonly createTaxeCase: CreateTaxeCase,
    private readonly updateTaxeCase: UpdateTaxeCase,
    private readonly getTaxesCase: GetTaxesCase,
    private readonly getTaxeCase: GetTaxeCase,
    private readonly getUsersCase: GetUsersCase,
    private readonly loginAsAnotherUserCase: LoginAsAnotherUserCase,
    private readonly updateUserTaxeCase: UpdateUserTaxeCase,
    private readonly getUserBalanceCase: GetUserBalanceCase,
    private readonly getUserMetricsCase: GetUserMetricsCase,
    private readonly toggleUserStatusCase: ToggleUserStatusCase,

    private readonly httpService: HttpService,
  ) {}

  // ADQUIRENT SERVICES
  async changeAdquirent(data: ChangeAdquirentDTO) {
    return this.changeAdquirentCase.execute(data);
  }

  async getCurrentAdquirents() {
    return this.getCurrentAdquirentsCase.execute();
  }

  async getAvailablesAdquirents() {
    return this.getAvailablesAdquirentsCase.execute();
  }

  // TAXES SERVICES
  async createTaxe(data: CreateTaxeDTO) {
    return this.createTaxeCase.execute(data);
  }

  async updateTaxe(data: CreateTaxeDTO) {
    return this.updateTaxeCase.execute(data);
  }

  async getTaxes() {
    return this.getTaxesCase.execute();
  }

  async getTaxe(taxeId: string) {
    return this.getTaxeCase.execute(taxeId);
  }

  // USERS SERVICES
  async getUser(query: GetAllUsersQueryDTO) {
    return this.getUsersCase.execute(query);
  }

  async loginAsUser(data: LoginAsAnotherUserDTO) {
    return this.loginAsAnotherUserCase.execute(data);
  }

  async updateUserTaxe(data: UpdateUserTaxeDTO) {
    return this.updateUserTaxeCase.execute(data);
  }

  async getUserBalance(user_id: string) {
    return this.getUserBalanceCase.execute(user_id, false);
  }

  async getUserMetrics(user_id: string) {
    return this.getUserMetricsCase.execute(user_id);
  }
  async toggleUserStatus(user_id: string) {
    return this.toggleUserStatusCase.execute(user_id);
  }

  // @Cron('*/10 * * * * *')
  // async checkAllLessonsVideoStatus() {
  //   const logger = new Logger('DEVELOPMENMT');
  //   logger.warn('CRIANDO TRANSAÇÃO');

  //   const response = await this.httpService.axiosRef.post('/checkout/payment', {
  //     affiliate_id: null,
  //     payment_method: 'PIX',
  //     use_two_cards: false,
  //     product_link: 'zalwyFHw',
  //     product_value: 100,
  //     payer: {
  //       name: 'jonhdoe',
  //       email: 'jonhdoe@gmail.com',
  //       address: null,
  //       document: '09772062380',
  //       birth_date: null,
  //       phone: null,
  //       utm: {
  //         source: '',
  //         medium: '',
  //         campaign: '',
  //         term: '',
  //         content: '',
  //       },
  //     },
  //     card_data: [],
  //     additional_products: [],
  //   });

  //   if (response.data) {
  //     const { data } = response.data;
  //     const transactionId = data.transaction_id;
  //     logger.warn('PAGANDO TRANSAÇÃO TRANSAÇÃO');

  //     await this.httpService.axiosRef.post('/ipn/paggueio?ipn_secret=teste', {
  //       hash: 'x',
  //       status: 1,
  //       paid_at: new Date(),
  //       amount: 1,
  //       external_id: transactionId,
  //       bank_account: '',
  //     });
  //   }

  //   return;
  // }
}
