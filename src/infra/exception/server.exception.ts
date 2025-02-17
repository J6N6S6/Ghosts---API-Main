import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ServerException extends BaseException {
  constructor(
    message: string,
    metadata?: Record<string, any>,
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super({ message, statusCode, metadata });
  }
}
