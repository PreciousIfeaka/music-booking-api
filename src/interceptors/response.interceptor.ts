import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response: Response = context.switchToHttp().getResponse();

    if (response.getHeader('Content-Type') === 'text/csv' || response.statusCode === 302) {
      return next.handle();
    }

    return next.handle().pipe(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      map((res: any) => this.responseHandler(res, context)),
      catchError((err: unknown) => throwError(() => this.errorHandler(err, context))),
    );
  }

  errorHandler(exception: unknown, context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    if (exception instanceof HttpException) return exception;
    this.logger.error(
      `Error processing request for ${req.method} ${req.url}, Message: ${exception!['message']}, Stack: ${exception!['stack']}`,
    );
    return new InternalServerErrorException({
      status_code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }

  responseHandler(
    res: { message: string; data: unknown, access_token?: string },
    context: ExecutionContext
  ) {
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse();
    const status_code = response.statusCode;

    if (!response.getHeader('Content-Type')) {
      response.setHeader('Content-Type', 'application/json');
    }

    if (typeof res === 'object') {
      const { message, access_token, ...data } = res

      return {
        success: true,
        status_code,
        message,
        ...(Object.keys(data).length > 0 ? { data } : {}),
        ...(access_token ? { access_token } : {})
      }
    } return res;
  }
}