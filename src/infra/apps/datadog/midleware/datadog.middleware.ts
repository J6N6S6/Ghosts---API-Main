import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import tracer from '../../datadog';

@Injectable()
export class DatadogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const span = tracer.startSpan('web.request');
    span.setTag('http.url', req.url);
    span.setTag('http.method', req.method);

    res.on('finish', () => {
      span.setTag('http.status_code', res.statusCode);
      span.finish();
    });

    next();
  }
}
