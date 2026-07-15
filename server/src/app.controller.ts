import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getStatus() {
    return {
      status: 'running',
      service: 'Edemy API Server',
      timestamp: new Date().toISOString(),
    };
  }
}
