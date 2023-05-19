import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { RequestTrackerService } from '../utils/request.tracker';
import { SlidingWindowManagerService } from '../windows/sliding.window.manager';
import { FixedWindowManagerService } from '../windows/fixed.wondow.manager';

@Injectable()
export class RatelimterService {
  constructor(
    private readonly fixedWindowManagerService: FixedWindowManagerService,
    private readonly RequestTracker: RequestTrackerService,
    private readonly slidingWindowManagerService: SlidingWindowManagerService,
  ) {}

  private readonly MONTHLY_EXPIRATION = 31 * 24 * 60 * 60;
  exceeded = false;

  async rateLimiter(
    context: ExecutionContext,
    limitWindow: number,
    limitCount: number,
  ): Promise<boolean> {
    const requestTracker = this.RequestTracker.trackRequest(context);
    const requestCount = await this.slidingWindowManagerService.trackRequest(
      requestTracker.apiKeys ?? requestTracker.ip,
      limitWindow,
      limitCount,
    );

    return requestCount > limitCount;
  }

  async monthlyRateLimiter(
    context: ExecutionContext,
    limitCount: number,
  ): Promise<boolean> {
    const requestTracker = this.RequestTracker.trackRequest(context);
    const requestCount =
      await this.fixedWindowManagerService.FixedWindowMonthly(
        requestTracker.apiKeys ?? requestTracker.ip,
        limitCount,
      );
    return requestCount > limitCount;
  }

  async systemRateLimit(
    limitWindow: number,
    limitCount: number,
  ): Promise<boolean> {
    const requestCount =
      await this.slidingWindowManagerService.trackRequestSystem(limitWindow);
    return requestCount > limitCount;
  }
}
