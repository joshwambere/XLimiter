import {
  CACHE_MANAGER,
  CacheModuleOptions,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async getValues<T>(key: string): Promise<T> {
    return await this.cacheService.get<T>(key);
  }
  async setValues<T>(
    key: string,
    value: T,
    options: CacheModuleOptions,
  ): Promise<T> {
    return await this.cacheService.set<T>(key, value, options);
  }

  async scanKeys<T>(pattern: string): Promise<any[]> {
    const keys = await this.cacheService.store.keys(`${pattern}*`);

    if (!keys) return [];

    let data = [];
    for (const key of keys) {
      const value = await this.cacheService.get<T>(key);
      data = data.concat(value);
    }
    return data;
  }
}
