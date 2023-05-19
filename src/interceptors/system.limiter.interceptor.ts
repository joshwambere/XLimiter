import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RatelimterService } from '../ratelimter/ratelimter.service';

@Injectable()
export class SystemLimitInterceptor implements NestInterceptor {
  constructor(private readonly ratelimterService: RatelimterService) {}

  private readonly SYSTEM_RATE_LIMIT_COUNT = parseInt(
    process.env.SYSTEM_RATE_LIMIT_COUNT,
    10,
  );
  private readonly SYSTEM_RATE_LIMIT_WINDOW = parseInt(
    process.env.SYSTEM_RATE_LIMIT_WINDOW,
    10,
  );

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const apiKey = context.switchToHttp().getRequest().get('api-key');

    const isWithinRateLimit = await this.ratelimterService.systemRateLimit(
      this.SYSTEM_RATE_LIMIT_WINDOW,
      this.SYSTEM_RATE_LIMIT_COUNT,
    );

    if (isWithinRateLimit) {
      throw new HttpException(
        'System reached maximum request',
        apiKey ? 429 : 503,
      );
    }
    return next.handle();
  }
}
