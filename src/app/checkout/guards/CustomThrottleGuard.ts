import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Request): any {
    // Usar o IP do cliente como chave
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  }
}
