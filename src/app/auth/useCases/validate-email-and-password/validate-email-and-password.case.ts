import { UsersRepository } from '@/domain/repositories';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ValidateEmailAndPasswordCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) return false;

    const passwordMatch = await bcrypt.compare(user.password, password);

    if (!passwordMatch) return false;

    return true;
  }
}
