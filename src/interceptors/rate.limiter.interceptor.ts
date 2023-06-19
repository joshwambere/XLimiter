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
export class RateLimitInterceptor implements NestInterceptor {
  constructor(private readonly ratelimterService: RatelimterService) {}
  private readonly threshold = 5;
  private readonly USER_RATE_LIMIT_WINDOW = parseInt(
    process.env.RATE_LIMIT_WINDOW,
    10,
  );
  private readonly USER_RATE_LIMIT_COUNT = parseInt(
    process.env.RATE_LIMIT_COUNT,
    10,
  );

  private readonly SYSTEM_RATE_LIMIT_WINDOW = parseInt(
    process.env.SYSTEM_RATE_LIMIT_WINDOW,
    10,
  );
  private readonly SYSTEM_RATE_LIMIT_COUNT = parseInt(
    process.env.SYSTEM_RATE_LIMIT_COUNT,
    10,
  );
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const isWithinRateLimit = await this.ratelimterService.rateLimiter(
      context,
      this.USER_RATE_LIMIT_WINDOW,
      this.USER_RATE_LIMIT_COUNT,
    );
    if (isWithinRateLimit) {
      throw new HttpException('Too many Requests', 429);
    }

    return next.handle();
  }
}
