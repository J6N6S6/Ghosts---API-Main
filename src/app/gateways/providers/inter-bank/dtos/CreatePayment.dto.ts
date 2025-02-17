import { InterPJIpn } from './InterPJIpn.dto';

export type CreatePaymentDTO = {
  txid: string;
  calendario: {
    expiracao: number;
  };
  devedor: {
    cpf?: string;
    cnpj?: string;
    nome: string;
  };
  valor: {
    original: string;
    modalidadeAlteracao: number;
  };
  chave: string;
  solicitacaoPagador: string;
  infoAdicionais: Array<{
    nome: string;
    valor: string;
  }>;
  status?: string;
  pix?: InterPJIpn[];
};
