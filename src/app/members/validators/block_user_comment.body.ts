import { IsNotEmpty } from 'class-validator';

export class BlockUserCommentBody {
  @IsNotEmpty()
  block_user_id: string;
}
