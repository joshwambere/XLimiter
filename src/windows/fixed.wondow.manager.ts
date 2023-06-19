import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class FixedWindowManagerService {
  constructor(private readonly redisService: RedisService) {}
  async FixedWindowMonthly(
    identifier: string,
    limitCount: number,
  ): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const windowKey = `window:${identifier}`;
    const window =
      (await this.redisService.getValues<string[]>(windowKey)) || [];

    // Remove entries outside the current month's window
    const updatedWindow = window.filter((timestamp) => {
      const timestampDate = new Date(parseInt(timestamp, 10));
      return timestampDate >= startOfMonth && timestampDate <= endOfMonth;
    });

    // Add current request timestamp to the window
    updatedWindow.push(now.getTime().toString());

    if (updatedWindow.length > limitCount) return updatedWindow.length;

    return updatedWindow.length;
  }
}
