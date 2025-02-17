import { TransactionsRepository } from '@/domain/repositories';
import { Injectable } from '@nestjs/common';
import { AdminMetricsDTO } from './get_admin_metrics.dto';

@Injectable()
export class GetAdminMetricsCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async execute(data: AdminMetricsDTO): Promise<any> {
    const {
      status = 'AUTHORIZED',
      payment_method,
      product_id,
      start_date,
      end_date,
    } = data;

    let queryString = `
      SELECT 
        SUM(CAST(split_account->>'amount_tax' AS DECIMAL)) AS total_revenue,
        SUM(transaction_amount) AS total_billing
      FROM transactions, jsonb_array_elements(split_accounts) AS split_account
      WHERE status = $1
    `;

    const queryParams: any[] = [status];
    let paramCounter = 2;

    if (payment_method) {
      queryString += ` AND payment_method = $${paramCounter}`;
      queryParams.push(payment_method);
      paramCounter++;
    }

    if (product_id) {
      queryString += ` AND split_account->>'product_id' = $${paramCounter}`;
      queryParams.push(product_id);
      paramCounter++;
    }

    if (start_date && end_date && start_date !== end_date) {
      queryString += ` AND date_created BETWEEN $${paramCounter} AND $${
        paramCounter + 1
      }`;
      queryParams.push(start_date, end_date);
      paramCounter += 2;
    }

    if (start_date && end_date) {
      if (start_date === end_date) {
        queryString += ` AND DATE(date_created) = $${paramCounter}`;
        queryParams.push(start_date);
        paramCounter++;
      } else {
        queryString += ` AND date_created BETWEEN $${paramCounter} AND $${
          paramCounter + 1
        }`;
        queryParams.push(start_date, end_date);
        paramCounter += 2;
      }
    }

    const [result]: any[] = await this.transactionsRepository.query(
      queryString,
      queryParams,
    );

    const total_revenue = Number(result?.total_revenue || 0).toFixed(2);
    const total_billing = Number(result?.total_billing || 0).toFixed(2);

    return {
      total_revenue: parseFloat(total_revenue),
      total_billing: parseFloat(total_billing),
    };
  }
}
