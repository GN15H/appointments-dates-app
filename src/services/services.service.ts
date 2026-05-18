import { Injectable } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service';
import { Service } from './entities/service.entity';
import { CreateServiceInput } from './dto/create-service.input';
import { randomUUID } from 'crypto';

@Injectable()
export class ServicesService {
  constructor(private dynamo: DynamoService) { }

  async create(input: CreateServiceInput): Promise<Service> {
    const service: Service = {
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
    };

    await this.dynamo.put({
      pk: `SERVICE#${service.id}`,
      sk: 'META',
      ...service,
    });

    return service;
  }

  async findAll(): Promise<Service[]> {
    const items = await this.dynamo.scan();
    return items.filter(i => i.pk?.startsWith('SERVICE#') && i.sk?.startsWith('META')) as Service[];
  }

  async findByService(id: string): Promise<Service[]> {
    const items = await this.dynamo.query(`SERVICE#${id}`, 'BOOKING#');
    return items as Service[];
  }

  async findById(id: string): Promise<Service | null> {
    const item = await this.dynamo.get(`SERVICE#${id}`, 'META');
    return item as Service ?? null;
  }
}
