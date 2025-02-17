import { UsersRepository } from '@/domain/repositories/users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetUserInvitesCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(user_id: string): Promise<{
    indication_link: string;
    indications: {
      id?: string;
      name?: string;
      email?: string;
      createdAt?: Date;
    }[];
  }> {
    const user = await this.usersRepository.findById(user_id);

    const users_invited = await this.usersRepository.findAllByInvitedBy(
      user_id,
    );

    return {
      indication_link: user.hash_link,
      indications: users_invited,
    };
  }
}
