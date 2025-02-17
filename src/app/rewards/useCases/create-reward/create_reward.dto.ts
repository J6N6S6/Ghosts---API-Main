export interface CreateRewardDTO {
  title: string;
  description: string;
  goal: number;
  image?: Buffer;
  available: boolean;
  delivery_mode: string;
}
