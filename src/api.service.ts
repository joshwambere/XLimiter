import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as os from 'os';

@Injectable()
export class ApiService {
  async getData(): Promise<any> {
    const url = 'https://jsonplaceholder.typicode.com/posts'; // Example API endpoint

    try {
      const response = await axios.get(url);
      const instance = os.hostname();
      return {
        instance,
        data: response.data,
      };
    } catch (error) {
      throw new Error('Failed to fetch data from the API.');
    }
  }
}
