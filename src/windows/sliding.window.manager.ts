import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SlidingWindowManagerService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * sliding window
   * */
  async trackRequest(
    identifier: string,
    limitWindow: number,
    limitCount: number,
  ): Promise<number> {
    const now = Date.now();
    const windowKey = `window:${identifier}`;
    const window =
      (await this.redisService.getValues<string[]>(windowKey)) || [];

    // Remove expired entries
    const updatedWindow = window.filter(
      (timestamp) => now - parseInt(timestamp, 10) <= limitWindow,
    );
    // Add current request timestamp to the window
    updatedWindow.push(now.toString());
    const expirationTimestamp = now - limitWindow;
    const finalWindow = updatedWindow.filter((timestamp) => {
      const entryTimestamp = parseInt(timestamp, 10);
      return entryTimestamp >= expirationTimestamp;
    });

    if (finalWindow.length > limitCount) {
      // Apply soft throttling logic
      const delay = this.calculateDelay(updatedWindow.length - limitCount);
      //delay request until next window
      await this.sleep(delay);
      return finalWindow.length;
    }

    await this.redisService.setValues<string[]>(windowKey, finalWindow, {
      ttl: Math.floor(limitWindow / 1000),
    });

    return finalWindow.length;
  }

  calculateDelay(exceededCount: number): number {
    // Calculate the delay based on the exceeded count
    // You can use a formula or a predefined logic to determine the delay
    return exceededCount * 5000;
  }

  async sleep(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Sliding window for tracking entire system
   * @param: limitWindow: number
   *
   */
  async trackRequestSystem(limitWindow: number): Promise<number> {
    const now = Date.now();
    const windowKey = `window:`;
    const windowKeys = await this.redisService.scanKeys<string[]>(windowKey);
    console.log('windows.....', windowKeys);
    const updatedWindow = windowKeys.filter(
      (timestamp) => now - parseInt(timestamp, 10) <= limitWindow,
    );

    return updatedWindow.length;
  }
}
