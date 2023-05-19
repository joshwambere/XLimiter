import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimitInterceptor } from './interceptors/rate.limiter.interceptor';
import { MonthlyLimitInterceptor } from './interceptors/monthly.limiter.interceptor';
import { SystemLimitInterceptor } from './interceptors/system.limiter.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(
    SystemLimitInterceptor,
    MonthlyLimitInterceptor,
    RateLimitInterceptor,
  )
  @Get('/')
  async getHello(): Promise<boolean> {
    return this.appService.getHello();
  }
}
