export interface NotificationData {
  id: string;
  title: string;
  description: string;
  type: string;
  read: boolean;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  socketId: string;
}
