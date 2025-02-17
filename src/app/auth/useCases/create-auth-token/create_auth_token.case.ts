import { ClientException } from '@/infra/exception/client.exception';
import { UserActivity } from '@/domain/models/user_activity.model';
import { UserSession } from '@/domain/models/user_sessions.model';
import {
  UserActivityRepository,
  UserSessionsRepository,
  UsersRepository,
} from '@/domain/repositories';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getDeviceInfo } from '../../helpers/getDeviceInfo';
import { GenerateRandomString } from '../../helpers/random';
import { CreateAuthTokenDTO } from './create_auth_token.dto';

@Injectable()
export class CreateAuthTokenCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userSessionsRepository: UserSessionsRepository,
    private readonly userActivityRepository: UserActivityRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({
    user_id,
    ip_address,
    user_agent,
    session_origin,
    is_login_as_another_user = false,
    metadata,
  }: CreateAuthTokenDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new ClientException('Usuario não encontrado');
    }

    const deviceInfo = getDeviceInfo(user_agent);
    const tokenSecret = GenerateRandomString(32);
    const refreshTokenSecret = GenerateRandomString(32);

    const userSessionModel = new UserSession({
      user_id: user.id,
      ip_address,
      device_name: deviceInfo.model,
      device_type: deviceInfo.type,
      session_origin: session_origin || deviceInfo.browser,
      token: tokenSecret,
      token_expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24 hours
      refresh_token: refreshTokenSecret,
      refresh_token_expires: new Date(
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000, // 7 days
      ),
      last_activity: new Date(),
    });

    const userSession = await this.userSessionsRepository.create(
      userSessionModel,
    );

    await this.userActivityRepository.create(
      new UserActivity({
        user_id: user.id,
        ip_address,
        activity_type: is_login_as_another_user
          ? 'SIGN_IN_BY_ANOTHER_USER'
          : 'SUCCESS_SIGN_IN',
        session_id: userSession.id,
        metadata: metadata,
      }),
    );

    const token = this.jwtService.sign(
      {
        user_id: user.id,
        email: user.email,
        secret: tokenSecret,
      },
      {
        expiresIn: is_login_as_another_user ? '1h' : '24h',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        user_id: user.id,
        email: user.email,
        secret: refreshTokenSecret,
      },
      {
        expiresIn: is_login_as_another_user ? '1h' : '7d',
      },
    );

    return {
      token,
      refresh_token: refreshToken,
      user_id: user.id,
      account_type: user.account_type,
      email: user.email,
      name: user.name,
      phone: user.phone,
      cpf: user.cpf,
      cnpj: user.cnpj,
      person_type: user.person_type,
      documentStatus: user.documentStatus,
    };
  }
}
