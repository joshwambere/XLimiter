import { Test, TestingModule } from '@nestjs/testing';
import { SlidingWindowManagerService } from './sliding.window.manager';
import { RedisService } from '../redis/redis.service';

describe('SlidingWindowManagerService', () => {
  let service: SlidingWindowManagerService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlidingWindowManagerService,
        {
          provide: RedisService,
          useValue: {
            getValues: jest.fn(),
            setValues: jest.fn(),
            scanKeys: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SlidingWindowManagerService>(
      SlidingWindowManagerService,
    );
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('trackRequest', () => {
    it('should track the request and return the final window length', async () => {
      const identifier = 'test-identifier';
      const limitWindow = 60000;
      const limitCount = 10;
      const windowKey = `window:${identifier}`;

      const result = await service.trackRequest(
        identifier,
        limitWindow,
        limitCount,
      );

      expect(result).toBe(1); // Added one more request to the window
      expect(redisService.getValues).toBeCalledWith(windowKey);
      expect(redisService.setValues).toBeCalledWith(
        windowKey,
        expect.any(Array),
        {
          ttl: Math.floor(limitWindow / 1000),
        },
      );
    });

    it('should return window length greater than limitCount ', async () => {
      const identifier = 'test-identifier';
      const limitWindow = 60000;
      const limitCount = 10;
      const windowKey = `window:${identifier}`;
      let counter = 0;
      for (let i = 0; i < 10 + 1; i++) {
        await service.trackRequest(identifier, limitWindow, limitCount);
        counter++;
      }

      expect(counter).toBeGreaterThan(limitCount); //more requests than limitCount
      expect(redisService.getValues).toBeCalledWith(windowKey);
      expect(redisService.setValues).toBeCalledWith(
        windowKey,
        expect.any(Array),
        {
          ttl: Math.floor(limitWindow / 1000),
        },
      );
    });
  });

  describe('trackRequestSystem', () => {
    it('should return window length if no values in redis then return 0', async () => {
      const limitWindow = 60000;

      const windowKey = 'window:';
      const result = await service.trackRequestSystem(limitWindow);

      expect(result).toBe(0);
      expect(redisService.scanKeys).toBeCalledWith(windowKey);
    });
  });
});
