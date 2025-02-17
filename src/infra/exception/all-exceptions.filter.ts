import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClientException } from './client.exception';
import { ServerException } from './server.exception';
import { ThrottlerException } from '@nestjs/throttler';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = 400;
    let message: string | object = 'Houve um erro inesperado';
    let metadata = {};
    const errorFields: string[] = [];

    if (
      exception instanceof ClientException ||
      exception instanceof ServerException
    ) {
      const { message: errorMessage, metadata: errorMetadata } =
        exception.getResponse() as {
          message: string | object;
          metadata: Record<string, any>;
        };
      status = exception.getStatus();

      if (typeof errorMessage === 'string') {
        message = errorMessage;
      } else {
        message = JSON.stringify(errorMessage);
      }

      metadata = errorMetadata || {};
    } else {
      if (exception instanceof BadRequestException) {
        status = exception.getStatus();
        if (typeof exception.getResponse() === 'string') {
          message = exception.getResponse();
        } else if (typeof exception.getResponse() === 'object') {
          const { message: error_msg } = exception.getResponse() as {
            message: string | string[];
          };
          message = 'Erro na validação dos campos';
          errorFields.push(
            ...(Array.isArray(error_msg)
              ? error_msg.filter((e) => !!e)
              : [error_msg]),
          );
        }
      } else if (exception instanceof HttpException) {
        status = exception.getStatus();
        message = exception.message;
      } else if (exception instanceof InternalServerErrorException) {
        status = exception.getStatus();
        message = 'Erro interno do servidor';
      } else if (exception instanceof ThrottlerException) {
        status = exception.getStatus();
        message = 'Aguarde um momento para tentar novamente';
      } else if (exception instanceof Error) {
        message = exception.message;
      }
    }

    const response_data = {
      hasError: true,
      error: message,
      errorFields,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // if (status >= 500 || exception instanceof ServerException) {
    //   this.sentryService.instance().captureException(exception, {
    //     extra: {
    //       metadata,
    //       request: {
    //         headers: request.headers,
    //         method: request.method,
    //         url: request.url,
    //       },
    //     },
    //   });
    // }

    return response.status(status).json(response_data);
  }
}
