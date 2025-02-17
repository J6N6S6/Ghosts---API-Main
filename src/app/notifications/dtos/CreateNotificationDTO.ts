export interface CreateNotificationDTO {
  user_id: string;
  body: string;
  actions?: {
    action: string;
    label: string;
    props?: {
      [key: string]: any;
    };
  }[];
  action_data?: object | null;
  action_type?: string;
  important?: boolean;
  notification_type?: string;
  icon: 'info' | 'warning' | 'error' | 'success' | string;
}
