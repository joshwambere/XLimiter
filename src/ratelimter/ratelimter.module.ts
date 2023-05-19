import { Module } from '@nestjs/common';
import { RatelimterService } from './ratelimter.service';
import { RedisService } from '../redis/redis.service';
import { RequestTrackerService } from '../utils/request.tracker';
import { SlidingWindowManagerService } from '../windows/sliding.window.manager';
import { FixedWindowManagerService } from '../windows/fixed.wondow.manager';

@Module({
  controllers: [],
  providers: [
    RatelimterService,
    RedisService,
    RequestTrackerService,
    SlidingWindowManagerService,
    FixedWindowManagerService,
  ],
})
export class RatelimterModule {}
