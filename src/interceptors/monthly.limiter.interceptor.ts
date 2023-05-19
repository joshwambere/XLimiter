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
export class MonthlyLimitInterceptor implements NestInterceptor {
  constructor(private readonly ratelimterService: RatelimterService) {}

  private readonly USER_MONTHLY_RATE_LIMIT_COUNT = parseInt(
    process.env.USER_MONTHLY_RATE_LIMIT_COUNT,
    10,
  );

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const apiKey = context.switchToHttp().getRequest().get('api-key');

    const isWithinRateLimit = await this.ratelimterService.monthlyRateLimiter(
      context,
      this.USER_MONTHLY_RATE_LIMIT_COUNT,
    );

    if (isWithinRateLimit) {
      throw new HttpException('Exceeded monthly limit', apiKey ? 429 : 503);
    }

    return next.handle();
  }
}
