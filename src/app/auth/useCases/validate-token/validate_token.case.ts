import { UserSessionsRepository } from '@/domain/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidateTokenCase {
  constructor(
    private readonly userSessionsRepository: UserSessionsRepository,
  ) {}

  async execute(user_id: string, token: string) {
    const userSession = await this.userSessionsRepository.findBy({
      where: { user_id, token },
      relations: ['user'],
      cache: true,
    });

    if (!userSession)
      return {
        valid: false,
        account_type: null,
      };

    if (userSession?.token_expires < new Date())
      return {
        valid: false,
        account_type: null,
      };

    return {
      valid: true,
      account_type: userSession.user.account_type,
      user_id: userSession.user.id,
      email: userSession.user.email,
      tags: userSession.user.tags,
    };
  }
}
