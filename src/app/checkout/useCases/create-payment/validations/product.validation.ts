import { taxes_per_value } from '@/config/taxes';
import { Products } from '@/infra/database/entities/products.entity';
import { ProductsLinks } from '@/infra/database/entities/products_links.entity';
import { ClientException } from '@/infra/exception/client.exception';

interface IProduct {
  product: Products;
  product_value: number;
  link: ProductsLinks;
  payment_method: string;
  card_data?: {
    card_number?: string;
    card_holder_name?: string;
    card_expiration_date?: string;
    card_cvv?: string;
    card_token?: string;

    installment: number;
    amount: number;
  }[];
}

export async function validateProduct({
  product,
  product_value,
  link,
  payment_method,
  card_data,
}: IProduct): Promise<void> {
  if (product.status !== 'APPROVED' || product?.owner?.blocked_access)
    throw new ClientException('Produto não habilitado para vendas!');

  if (link) {
    if (link.price !== product_value)
      throw new ClientException('Valor do produto inválido');

    if (link.status !== 'active')
      throw new ClientException('Link do produto inválido');
  } else {
    if (product_value !== product.price)
      throw new ClientException('Valor do produto inválido');
  }

  if (payment_method === 'CREDIT_CARD') {
    if (!card_data || card_data.length <= 0)
      throw new ClientException('Dados do cartão não informados');

    for (const card of card_data) {
      if (!card.installment)
        throw new ClientException('Parcelas do cartão não informadas');
      if (!card.amount)
        throw new ClientException('Valor do cartão não informado');
      if (!card.card_token) {
        if (!card.card_number)
          throw new ClientException('Número do cartão não informado');
        if (!card.card_holder_name)
          throw new ClientException('Nome do cartão não informado');
        if (!card.card_expiration_date)
          throw new ClientException(
            'Data de expiração do cartão não informada',
          );
        if (!card.card_cvv)
          throw new ClientException('CVV do cartão não informado');
      }

      const calculate_payment = calculateCardInstallments(
        card.amount,
        card.installment,
      );

      if (calculate_payment.installment_value < 5)
        throw new ClientException(
          'Valor da parcela não atingiu o valor mínimo de R$5,00',
        );
    }
  }
}

function calculateCardInstallments(
  value: number,
  installment: number,
): {
  installment: number;
  installment_value: number;
  total_value: number;
  tax: number;
} {
  if (installment === 1)
    return {
      installment,
      installment_value: value,
      total_value: value,
      tax: 0,
    };

  const tax_installments = taxes_per_value.find(
    (installment) =>
      installment.min_value <= value &&
      (installment.max_value === null || installment.max_value >= value),
  )?.installments[installment];

  const total_value = value * (1 + tax_installments);

  // Calcular o valor da parcela com base na taxa
  const installment_value = total_value / installment;

  return {
    installment,
    installment_value,
    total_value,
    tax: total_value - value,
  };
}
