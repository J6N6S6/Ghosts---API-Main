import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUtmfyCredentialsBody {
  @IsString()
  @IsNotEmpty()
  api_token: string;
}
