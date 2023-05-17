import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async getValues(key: string): Promise<string> {
    this.setValues('test', 'test data');
    const value = await this.cacheService.get<string>(key);
    if (value) {
      return value;
    }
    return 'No value found';
  }
  async setValues(key: string, value: string): Promise<string> {
    const result = await this.cacheService.set(key, value, { ttl: 1000 });
    return result;
  }
}
