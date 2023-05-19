import { Injectable } from '@nestjs/common';
import { ApiService } from './api.service';
@Injectable()
export class AppService {
  constructor(private readonly apiService: ApiService) {}
  async getHello(): Promise<any> {
    return this.apiService.getData();
  }
}
