import { UsersRepository } from '@/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserDocumentCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(user_id: string): Promise<any> {
    const user = await this.usersRepository.findById(user_id);

    return {
      status: user.documentStatus,
      validated: user.documentValidated,
    };
  }
}
