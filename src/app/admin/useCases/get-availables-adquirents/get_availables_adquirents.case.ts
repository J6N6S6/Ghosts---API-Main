import { Injectable } from '@nestjs/common';

@Injectable()
export class GetAvailablesAdquirentsCase {
  async execute() {
    const availablesPixAdquirents = ['FIREBANKING'];
    const availablesCardAdquirents = [];
    const availablesBankSlipAdquirents = [];

    return {
      PIX: availablesPixAdquirents,
      CREDIT_CARD: availablesCardAdquirents,
      BANK_SLIP: availablesBankSlipAdquirents,
    };
  }
}
