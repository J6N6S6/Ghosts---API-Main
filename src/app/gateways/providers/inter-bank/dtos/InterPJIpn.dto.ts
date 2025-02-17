export interface InterPJIpn {
  endToEndId: string;
  chave: string;
  componentesValor: ComponentesValor;
  txid: string;
  valor: string;
  horario: string;
  infoPagador: string;
  devolucoes: Devolucoes[];
}

export interface ComponentesValor {
  original: Original;
}

export interface Original {
  valor: number;
}

export interface Devolucoes {
  id: string;
  rtrId: string;
  valor: string;
  horario: Horario;
  status: string;
}

export interface Horario {
  solicitacao: string;
}
