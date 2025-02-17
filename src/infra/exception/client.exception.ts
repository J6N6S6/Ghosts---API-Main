import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

export class ClientException extends BaseException {
  constructor(message: string, statusCode = HttpStatus.BAD_REQUEST) {
    super({ message, statusCode });
  }
}
