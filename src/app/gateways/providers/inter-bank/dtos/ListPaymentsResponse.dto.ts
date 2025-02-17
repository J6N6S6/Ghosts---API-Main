import { CreatePaymentDTO } from './CreatePayment.dto';

export type ListPaymentsResponseDTO = {
  parametos: {
    inicio: string;
    fim: string;
    paginacao: {
      paginaAtual: number;
      itensPorPagina: number;
      quantidadeDePaginas: number;
      quantidadeTotalDeItens: number;
    };
    cobs: CreatePaymentDTO[];
  };
};
