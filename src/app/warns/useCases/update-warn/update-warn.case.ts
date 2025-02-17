import { Injectable } from '@nestjs/common';
import { UsersRepository, WarnsRepository } from '@/domain/repositories';
import { Warn } from '@/domain/models/warns.model';

type Input = Partial<{
  id: string;
  title: string;
  description?: string;
  status: 'CRITICAL' | 'LOW';
  created_by: string;
}>;

@Injectable()
export class UpdateWarnCase {
  constructor(
    private readonly warnsRepository: WarnsRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async execute({ id, title, description, status, created_by }: Input) {
    const user = await this.userRepository.findById(created_by);

    if (!user) {
      return;
    }

    const warn = await this.warnsRepository.findById(id);

    if (!warn) {
      return;
    }

    const newWarn = {
      id: warn.id,
      title,
      description,
      status,
      created_by: user.id,
      created_at: warn.created_at,
      user,
    };

    await this.warnsRepository.update(newWarn);

    const { user: userWarn, ...rest } = newWarn;

    return { ...rest };
  }
}
