import { Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}
  async getHello(): Promise<string> {
    const value = await this.redisService.getValues('test');
    console.log(value);
    return `Hello World:! ${value}`;
  }
}
