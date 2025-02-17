import { IsString } from 'class-validator';

export class UpdateUserDocumentBody {
  @IsString()
  identity: string;
}
