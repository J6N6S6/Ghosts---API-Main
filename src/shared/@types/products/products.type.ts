export enum ProductsType {
  EBOOK = 'EBOOK',
  ONLINE_COURSE = 'ONLINE_COURSE',
  MENTORING = 'MENTORING',
}

export enum ProductsCurrency {
  BRL = 'BRL',
  USD = 'USD',
}

export enum ProductsChargeType {
  ONE_TIME = 'ONE_TIME',
  RECURRING = 'RECURRING',
}

export enum ProductsStatus {
  IN_PRODUCTION = 'IN_PRODUCTION',
  IN_UPDATE = 'IN_UPDATE',
  IN_REVIEW = 'IN_REVIEW',
  DESACTIVED = 'DESACTIVED',
  APPROVED = 'APPROVED',
}

export enum ProductsMembershipPeriod {
  MENSAL = 'MENSAL',
  BIMESTRAL = 'BIMESTRAL',
  ANUAL = 'ANUAL',
  SEMESTRAL = 'SEMESTRAL',
  UNIQUE = 'UNIQUE',
}

export interface ProductPreferences {
  color_header: string | null;
  color_footer: string | null;
  background_color: string | null;
  contact: {
    allowed: boolean;
    message: string;
    number: string;
  };
  options_pay: string[];
  time_to_pay: number | null;
  notifications: any;
}

export const ProductPreferencesDefault: ProductPreferences = {
  color_header: null,
  color_footer: null,
  background_color: null,
  contact: {
    allowed: false,
    message: '',
    number: '',
  },
  notifications: {},
  options_pay: ['PIX', 'CREDIT_CARD', 'BANK_SLIP'],
  time_to_pay: null,
};
