import { Injectable } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service';
import { Service } from './entities/service.entity';
import { CreateServiceInput } from './dto/create-service.input';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ServicesService {
  constructor(private dynamo: DynamoService) { }

  async create(input: CreateServiceInput): Promise<Service> {
    const service: Service = {
      id: uuidv4(),
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
    console.log('uy mano esto si son items', items as Service[]);
    return items.filter(i => i.pk?.startsWith('SERVICE#')) as Service[];
  }

  async findById(id: string): Promise<Service | null> {
    const item = await this.dynamo.get(`SERVICE#${id}`, 'META');
    return item as Service ?? null;
  }
}
