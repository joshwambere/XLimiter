# XLimiter
is a simple rate limiter for NestJS. using [redis](https://www.npmjs.com/package/redis) packages.
## Description
in this package we have multiple decorators for rate limiting.
- `@RateLimit` for limiting requests per second.
- `@RateLimitPerMinute` for limiting requests per minute.
- `@RateLimitPerHour` for limiting requests per hour.
- `@RateLimitPerDay` for limiting requests per day.
- `@RateLimitPerWeek` for limiting requests per week.
- `@RateLimitPerMonth` for limiting requests per month.
- `@RateLimitPerYear` for limiting requests per year.
- `@RateLimitPerCustom` for limiting requests per custom time.
## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Documentation
below you can see the c4 model of this package.

### Context

![rate - System Landscape.jpeg](./assets/rate%20-%20System%20Landscape.jpeg)

### Containers (Rate limit api)
![rate - Containers.jpeg](./assets/Rate%20limiter%20(API)%20-%20Container.png)

### Components (Rate limit api)
![rate - Components.jpeg](./assets/Rate%20limiter%20-%20Component%20(3).png)


## Stay in touch
This readme is going to be updated soon.

## License
Nest is [MIT licensed](LICENSE).

## Appreciation
I appreciate [NestJS](https://nestjs.com/) team for their great framework and [redis](https://www.npmjs.com/package/redis) team for their great package.

