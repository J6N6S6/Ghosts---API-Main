import { HttpException, HttpStatus } from '@nestjs/common';

interface BaseExceptionOptions {
  message: string;
  statusCode?: HttpStatus;
  metadata?: Record<string, any>;
}

export class BaseException extends HttpException {
  constructor({
    message,
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    metadata,
  }: BaseExceptionOptions) {
    super({ message, metadata }, statusCode);
  }
}
