import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { In } from 'typeorm';
import { IESessionRepository } from '@/domain/repositories/session.reposity';
import { SessionModel } from '@/domain/models/session.model';
import { CreateNewSessionDto } from './createNewSession.dto';

@Injectable()
export class CreateNewSessionCase {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly sessionRepository: IESessionRepository,
  ) {}

  async execute(data: CreateNewSessionDto) {
    const oldSession = await this.sessionRepository.findOne({
      where: {
        user_email: data.user_email,
      },
    });

    if (oldSession) {
      const newSessionModel = new SessionModel(oldSession);
      newSessionModel.access_token = data.access_token;
      newSessionModel.refresh_token = data.refresh_token;
      newSessionModel.origin = data.origin;
      newSessionModel.available_balance = data.available_balance;

      newSessionModel.created_at = new Date();

      const newSession = await this.sessionRepository.update(newSessionModel);
      return 'Sessão atualizada !';
    }

    const sessionModel = new SessionModel(data);

    const session = await this.sessionRepository.create(sessionModel);

    return session;
  }
}
