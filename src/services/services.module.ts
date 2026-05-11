import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesResolver } from './services.resolver';
import { ServicesController } from './services.controller';

@Module({
  providers: [ServicesService, ServicesResolver],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule { }
