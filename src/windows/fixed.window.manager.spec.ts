import { Test, TestingModule } from '@nestjs/testing';
import { FixedWindowManagerService } from './fixed.wondow.manager';
import { RedisService } from '../redis/redis.service';

describe('FixedWindowManagerService', () => {
  let service: FixedWindowManagerService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FixedWindowManagerService,
        {
          provide: RedisService,
          useValue: {
            getValues: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FixedWindowManagerService>(FixedWindowManagerService);
    redisService = module.get<RedisService>(RedisService);
  });

  describe('FixedWindowMonthly', () => {
    it('should return one since there is no already request in Redis', async () => {
      // Mock dependencies
      const identifier = 'test-identifier';
      const limitCount = 10;
      const windowKey = `window:${identifier}`;

      const result = await service.FixedWindowMonthly(identifier, limitCount);

      expect(result).toBe(1);
      expect(redisService.getValues).toHaveBeenCalledWith(windowKey);
    });
  });
});
