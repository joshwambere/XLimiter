import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ApiService {
  async getData(): Promise<any> {
    const url = 'https://jsonplaceholder.typicode.com/posts'; // Example API endpoint

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch data from the API.');
    }
  }
}
