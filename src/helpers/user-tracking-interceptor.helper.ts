import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Tracer } from 'opentracing';

@Injectable()
export class UserTrackingInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming user object is present in the request

    const span = new Tracer().startSpan('web.request');

    // Add basic user information to the span
    span.addTags({
      'user.id': user.id,
      'user.name': user.name,
      'user.email': user.email,
    });

    // Conditionally add the IP address based on the configuration
    // if (this.config.trackIpAddress) {
    //   span.addTags({ 'user.ip_address': request.ip });
    // }

    // Close the span when the request handling is complete
    return next.handle().pipe(tap(() => span.finish()));
  }
}
