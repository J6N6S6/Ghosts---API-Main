export interface SendMetaMetricsDTO {
  short_id: string;
  data: {
    event_name: string;
    event_time: number;
    user_data: {
      em?: string; // email with hash
      ph?: string; // phone with hash
      fn?: string; // first name
      ln?: string; // last name
      db?: string; // date of birth
      ge?: string; // f or m
      ct?: string; // city
      st?: string; // state
      zp?: string; // zip code
      country?: string; // country code
      external_id: string; // client id
      client_ip_address: string; // client ip
      client_user_agent: string; // client user agent
      fbc?: string; // facebook click id
      fbp?: string; // facebook browser id
      subscription_id?: string; // subscription id
    };
    custom_data?: {
      [key: string]: any;
    };
    event_source_url?: string;
    opt_out?: boolean;
    event_id?: string;
    action_source?: string;
  };
  test_event_code?: string;
}
