import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RatelimterService } from './ratelimter.service';
import { RequestTrackerService } from '../utils/request.tracker';
import { SlidingWindowManagerService } from '../windows/sliding.window.manager';
import { FixedWindowManagerService } from '../windows/fixed.wondow.manager';
import { RedisService } from '../redis/redis.service';

describe('RatelimterService', () => {
  let service: RatelimterService;
  let fixedWindowManagerService: FixedWindowManagerService;
  let requestTrackerService: RequestTrackerService;
  let slidingWindowManagerService: SlidingWindowManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatelimterService,
        FixedWindowManagerService,
        RequestTrackerService,
        SlidingWindowManagerService,
        {
          provide: RequestTrackerService,
          useValue: {
            trackRequest: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            getValues: jest.fn(),
            setValues: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RatelimterService>(RatelimterService);
    fixedWindowManagerService = module.get<FixedWindowManagerService>(
      FixedWindowManagerService,
    );
    requestTrackerService = module.get<RequestTrackerService>(
      RequestTrackerService,
    );
    slidingWindowManagerService = module.get<SlidingWindowManagerService>(
      SlidingWindowManagerService,
    );
  });

  describe('rateLimiter', () => {
    it('should return true if request count exceeds the limit', async () => {
      // Mock dependencies
      const context = {} as ExecutionContext;
      const limitWindow = 60000;
      const limitCount = 10;
      const requestTracker = { apiKeys: 'api-key', ip: '127.0.0.1' };

      jest
        .spyOn(requestTrackerService, 'trackRequest')
        .mockReturnValue(requestTracker);
      jest
        .spyOn(slidingWindowManagerService, 'trackRequest')
        .mockResolvedValue(limitCount + 1);

      const result = await service.rateLimiter(
        context,
        limitWindow,
        limitCount,
      );

      expect(result).toBe(true);
      expect(requestTrackerService.trackRequest).toHaveBeenCalledWith(context);
      expect(slidingWindowManagerService.trackRequest).toHaveBeenCalledWith(
        requestTracker.apiKeys ?? requestTracker.ip,
        limitWindow,
        limitCount,
      );
    });

    it('should return false if request count does not exceed the limit', async () => {
      // Mock dependencies
      const context = {} as ExecutionContext;
      const limitWindow = 60000;
      const limitCount = 10;
      const requestTracker = { apiKeys: 'api-key', ip: '127.0.0.1' };

      jest
        .spyOn(requestTrackerService, 'trackRequest')
        .mockReturnValue(requestTracker);
      jest
        .spyOn(slidingWindowManagerService, 'trackRequest')
        .mockResolvedValue(limitCount);

      const result = await service.rateLimiter(
        context,
        limitWindow,
        limitCount,
      );

      expect(result).toBe(false);
      expect(requestTrackerService.trackRequest).toHaveBeenCalledWith(context);
      expect(slidingWindowManagerService.trackRequest).toHaveBeenCalledWith(
        requestTracker.apiKeys ?? requestTracker.ip,
        limitWindow,
        limitCount,
      );
    });
  });

  describe('monthlyRateLimiter', () => {
    it('should return true if request count exceeds the limit', async () => {
      // Mock dependencies
      const context = {} as ExecutionContext;
      const limitCount = 10;
      const requestTracker = { apiKeys: 'api-key', ip: '127.0.0.1' };

      jest
        .spyOn(requestTrackerService, 'trackRequest')
        .mockReturnValue(requestTracker);
      jest
        .spyOn(fixedWindowManagerService, 'FixedWindowMonthly')
        .mockResolvedValue(limitCount + 1);

      const result = await service.monthlyRateLimiter(context, limitCount);

      expect(result).toBe(true);
      expect(requestTrackerService.trackRequest).toHaveBeenCalledWith(context);
      expect(fixedWindowManagerService.FixedWindowMonthly).toHaveBeenCalledWith(
        requestTracker.apiKeys ?? requestTracker.ip,
        limitCount,
      );
    });

    it('should return false if request count does not exceed the limit', async () => {
      // Mock dependencies
      const context = {} as ExecutionContext;
      const limitCount = 10;
      const requestTracker = { apiKeys: 'api-key', ip: '127.0.0.1' };

      jest
        .spyOn(requestTrackerService, 'trackRequest')
        .mockReturnValue(requestTracker);
      jest
        .spyOn(fixedWindowManagerService, 'FixedWindowMonthly')
        .mockResolvedValue(limitCount);

      const result = await service.monthlyRateLimiter(context, limitCount);

      expect(result).toBe(false);
      expect(requestTrackerService.trackRequest).toHaveBeenCalledWith(context);
      expect(fixedWindowManagerService.FixedWindowMonthly).toHaveBeenCalledWith(
        requestTracker.apiKeys ?? requestTracker.ip,
        limitCount,
      );
    });
  });

  describe('systemRateLimit', () => {
    it('should return true if request count exceeds the limit', async () => {
      // Mock dependencies
      const limitWindow = 60000;
      const limitCount = 10;

      jest
        .spyOn(slidingWindowManagerService, 'trackRequestSystem')
        .mockResolvedValue(limitCount + 1);

      const result = await service.systemRateLimit(limitWindow, limitCount);

      expect(result).toBe(true);
      expect(
        slidingWindowManagerService.trackRequestSystem,
      ).toHaveBeenCalledWith(limitWindow);
    });

    it('should return false if request count does not exceed the limit', async () => {
      // Mock dependencies
      const limitWindow = 60000;
      const limitCount = 10;

      jest
        .spyOn(slidingWindowManagerService, 'trackRequestSystem')
        .mockResolvedValue(limitCount);

      const result = await service.systemRateLimit(limitWindow, limitCount);

      expect(result).toBe(false);
      expect(
        slidingWindowManagerService.trackRequestSystem,
      ).toHaveBeenCalledWith(limitWindow);
    });
  });
});
