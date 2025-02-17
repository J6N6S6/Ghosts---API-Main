import { UserSession } from '@/domain/models/user_sessions.model';
import { UserSessionsRepository } from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getDeviceInfo } from '../../helpers/getDeviceInfo';
import { GenerateRandomString } from '../../helpers/random';
import { RefreshTokenDTO } from './refresh_token.dto';

@Injectable()
export class RefreshTokenCase {
  constructor(
    private readonly userSessionsRepository: UserSessionsRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({
    refresh_token,
    ip_address,
    user_agent,
    session_origin,
  }: RefreshTokenDTO) {
    try {
      this.jwtService.verify(refresh_token);
    } catch {
      throw new ClientException('Token inválido');
    }

    const { user_id, secret } = this.jwtService.decode(refresh_token) as {
      user_id: string;
      secret: string;
    };

    if (!user_id || !secret) new ClientException('Token inválido');

    const userSession = await this.userSessionsRepository.findBy({
      where: { refresh_token: secret, user_id },
      relations: ['user'],
    });

    if (!userSession) new ClientException('Token inválido');
    if (userSession?.refresh_token_expires < new Date())
      new ClientException('Token expirado');
    if (userSession.ip_address !== ip_address)
      new ClientException('Token inválido');

    const deviceInfo = getDeviceInfo(user_agent);
    if (
      userSession.device_type !== deviceInfo.type ||
      userSession.device_name !== deviceInfo.model ||
      userSession.session_origin !== session_origin
    )
      new ClientException('Token inválido');

    const tokenSecret = GenerateRandomString(32);
    const refreshTokenSecret = GenerateRandomString(32);

    const userSessionModel = new UserSession({
      ...userSession,
      token: tokenSecret,
      token_expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      refresh_token: refreshTokenSecret,
      refresh_token_expires: new Date(
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
      ),
      last_activity: new Date(),
    });

    await this.userSessionsRepository.update(userSessionModel);

    const token = this.jwtService.sign(
      {
        user_id: userSession.user.id,
        email: userSession.user.email,
        secret: tokenSecret,
      },
      {
        expiresIn: '24h',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        user_id: userSession.user.id,
        email: userSession.user.email,
        secret: refreshTokenSecret,
      },
      {
        expiresIn: '7d',
      },
    );

    return {
      token,
      refresh_token: refreshToken,
      user_id: userSession.user?.id,
      account_type: userSession.user?.account_type,
      email: userSession.user?.email,
      name: userSession.user?.name,
      phone: userSession.user?.phone,
      cpf: userSession.user?.cpf,
      cnpj: userSession.user?.cnpj,
      person_type: userSession.user?.person_type,
      documentStatus: userSession.user?.documentStatus,
    };
  }
}
