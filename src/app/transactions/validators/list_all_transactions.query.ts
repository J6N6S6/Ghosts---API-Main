export interface listAllTransactionsQuery {
  page: number;
  items_per_page: number;
  search?: string;

  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;

  start_date?: string;
  end_date?: string;

  payment_method?: string[] | 'all';
  status?: string[] | 'all';
  products?: string[] | 'all';
  links?: string[] | 'all';
}
