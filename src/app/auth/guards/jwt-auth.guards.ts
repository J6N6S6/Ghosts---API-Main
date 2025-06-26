import {
  IS_ASSISTENT_KEY,
  IsAssistent,
} from './../decorators/endpoint-assistent.decorator';
import { ClientException } from '@/infra/exception/client.exception';
import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import * as Sentry from '@sentry/node';
import { IS_ADMIN_KEY } from '../decorators/endpoint-admin.decorator';
import { IS_PUBLIC_KEY } from '../decorators/endpoint-public.decorator';
import { AuthService } from '../services/auth.service';
import { request as httpRequest } from 'http';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Permite acesso à rota de health sem autenticação
    if (request.method === 'GET' && request.path === '/health') {
      return true;
    }
    const handler = context.getHandler();
    const controller = context.getClass();

    // Usar Reflector para obter todos os metadados do handler e da classe

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const IsAssistent = this.reflector.getAllAndOverride<boolean>(
      IS_ASSISTENT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      const request = context.switchToHttp().getRequest();
      const userAgent = request.headers['user-agent'] || ''; // Obtém o user agent, padrão vazio se não presente
      const userIp = request.ip || request.connection.remoteAddress; // Obtém o IP do usuário
      const userAgentBlackList = ['curl', 'python', 'noth'];
      const ipBlackList = [
        '18.231.109.230',
        '170.78.156.137',
        '189.120.72.157',
      ]; // Substitua pelos IPs que deseja bloquear

      // Verifica se o user agent está na lista negra
      const isInUserAgentBlackList = userAgentBlackList.some(
        (blacklistedAgent) =>
          userAgent.toLowerCase().includes(blacklistedAgent),
      );

      // Verifica se o IP está na lista negra
      const isInIpBlackList = userIp
        .split(',')
        .map((ip) => ip.trim()) // Remove espaços extras
        .some((ip) => ipBlackList.includes(ip));

      return !(isInUserAgentBlackList || isInIpBlackList);
    }

    const canActivate = await super.canActivate(context);

    if (canActivate) {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1]; // Obtém o token

      //valida o token
      if (!token)
        throw new ClientException(
          'Token não informado',
          HttpStatus.UNAUTHORIZED,
        );
      if (!this.jwtService.verify(token))
        throw new ClientException('Token inválido', HttpStatus.UNAUTHORIZED);

      const { user_id, secret } = this.jwtService.decode(token) as {
        user_id: string;
        secret: string;
        email: string;
      };

      // Verifica se o token é válido
      const user_validated = await this.authService.validateToken(
        user_id,
        secret,
      );

      if (!user_validated.valid)
        throw new ClientException(
          'Invalid access token',
          HttpStatus.UNAUTHORIZED,
        );

      // if (!user_validated.tags.includes('sunize-v2-bypass')) {
      //   throw new ClientException(
      //     'Estamos em manutenção, tente novamente mais tarde.',
      //   );
      // }

      Sentry.setUser({
        id: user_id,
        email: user_validated.email,
        ip_address: request.ip,
      });

      if (
        user_validated &&
        user_validated.account_type === 'USER' &&
        IsAssistent
      )
        throw new ClientException(
          'Você precisa ser um assistente para acessar este recurso',
          HttpStatus.METHOD_NOT_ALLOWED,
        );

      if (user_validated && user_validated.account_type !== 'ADMIN' && isAdmin)
        throw new ClientException(
          'Você precisar ser um administrador para acessar este recurso',
          HttpStatus.METHOD_NOT_ALLOWED,
        );

      return true;
    }

    throw new ClientException(
      'Você não tem permissão para acessar este recurso',
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}
