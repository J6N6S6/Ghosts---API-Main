import { ProcessBalanceRegularizationCase } from './../process-balance-regularization/process-balance-regularization.case';
// settle-user-reserved-balance.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';

@Injectable()
export class BalanceRegularizationCase {
  constructor(
    private readonly userSecureReserveRepository: IEUserSecureReserveRepository,
    private readonly processBalanceRegularizationCase: ProcessBalanceRegularizationCase,

    @InjectQueue('process_balance_regularization')
    private readonly processBalanceRegularizationQueue: Queue,
  ) {}

  async execute(job: Job<any>): Promise<any> {
    console.log('EXECUTANDO O BALANCE REGULARIZATION CASE: ', job.data);
    const user_id = job.data.user_id;
    const user_available_balance = job.data.user_available_balance;
    if (user_available_balance >= 0) return;

    // Se o saldo é negativo, usar o valor absoluto e adicionar 10% a mais
    const targetAmount = Number(Math.abs(user_available_balance) * 1.1);
    console.log('VALOR ALVO: ', targetAmount);

    let currentTotal = Number(0);
    const selectedTransactions = [];
    let skip = 0; // Variável para controlar a paginação (pular as transações já processadas)
    const pageSize = 10; // Número de transações que serão buscadas por vez

    try {
      while (currentTotal < targetAmount) {
        // Buscar um lote de 10 transações de cada vez
        const transactions = await this.userSecureReserveRepository.findMany({
          where: {
            user_id,
            status: 'in_reserve',
          },
          order: {
            created_at: 'ASC',
          },
          skip, // Pular as transações já processadas
          take: pageSize, // Limitar a busca ao tamanho do lote
        });

        if (transactions.length === 0) {
          // Se não houver mais transações a serem buscadas, encerra o loop
          break;
        }

        // Iterar sobre as transações e acumular os valores
        for (const transaction of transactions) {
          currentTotal += transaction.value;
          selectedTransactions.push(transaction);

          if (currentTotal >= targetAmount) {
            break; // Parar se o valor alvo for atingido ou ultrapassado
          }
        }

        // Incrementar o `skip` para buscar o próximo lote de transações
        skip += pageSize;
      }

      if (selectedTransactions.length === 0) return; // Se nenhuma transação foi selecionada, encerra

      console.log('TRANSAÇÕES SELECIONADAS: ', selectedTransactions);

      // Adicionar todas as transações selecionadas à fila
      const jobs = selectedTransactions.map((transaction) =>
        this.processBalanceRegularizationQueue.add(transaction, {
          jobId: transaction.id,
        }),
      );
      await Promise.all(jobs);
    } catch (error) {
      console.error(error);
    }
  }
}
