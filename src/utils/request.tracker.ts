import { Injectable, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RequestTrackerService {
  trackRequest(context: ExecutionContext): RequestTracker {
    console.log('context', context);
    const request: Request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const userAgent = request.get('user-agent');
    const apiKeys = request.get('api-key');
    return { ip, userAgent, apiKeys };
  }
}
