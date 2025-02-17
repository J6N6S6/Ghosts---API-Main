import { Injectable } from '@nestjs/common';
import { Warn } from '@/domain/models/warns.model';
import { CreateWarnDTO } from '@/app/warns/dtos/CreateWarnDTO';
import { WarnsRepository } from '@/domain/repositories/warns.repository';
import { UsersRepository } from '@/domain/repositories/users.repository';

@Injectable()
export class CreateWarnCase {
  constructor(
    private readonly warnsRepository: WarnsRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async execute({ title, description, status, created_by }: CreateWarnDTO) {
    const user = await this.userRepository.findById(created_by);

    if (!user) {
      return;
    }

    const warn = new Warn({
      title,
      description,
      status,
      created_by: user.id,
      user,
    });

    await this.warnsRepository.create(warn);

    return warn.toOutput();
  }
}
