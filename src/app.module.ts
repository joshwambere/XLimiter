import { CacheModule, HttpService, Module } from "@nestjs/common";
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import { SlidingWindowManagerService } from './windows/sliding.window.manager';
import { RequestTrackerService } from './utils/request.tracker';
import { RatelimterModule } from './ratelimter/ratelimter.module';
import { RatelimterService } from './ratelimter/ratelimter.service';
import { FixedWindowManagerService } from './windows/fixed.wondow.manager';
import { ApiService } from './api.service';
import { AXIOS_INSTANCE_TOKEN } from "@nestjs/common/http/http.constants";

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      no_ready_check: true,
    }),
    RatelimterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RatelimterService,
    RedisService,
    RequestTrackerService,
    SlidingWindowManagerService,
    FixedWindowManagerService,
    ApiService,
  ],
})
export class AppModule {}
