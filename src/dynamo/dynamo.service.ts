import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoService {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string | undefined;

  constructor(private configService: ConfigService) {
    const dynamo = new DynamoDBClient({
      region: this.configService.get<string>("AWS_REGION"),
      // pro
    });
    this.client = DynamoDBDocumentClient.from(dynamo);
    this.tableName = this.configService.get<string>("DYNAMO_TABLE_NAME");
  }

  async put(item: Record<string, any>) {
    await this.client.send(new PutCommand({
      TableName: this.tableName,
      Item: item,
    }));
  }

  async get(pk: string, sk: string) {
    const result = await this.client.send(new GetCommand({
      TableName: this.tableName,
      Key: { pk, sk },
    }));
    return result.Item;
  }

  async query(pk: string, skPrefix?: string) {
    const result = await this.client.send(new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: skPrefix
        ? 'pk = :pk AND begins_with(sk, :sk)'
        : 'pk = :pk',
      ExpressionAttributeValues: skPrefix
        ? { ':pk': pk, ':sk': skPrefix }
        : { ':pk': pk },
    }));
    return result.Items ?? [];
  }

  async update(pk: string, sk: string, updates: Record<string, any>) {
    const entries = Object.entries(updates);
    const expression = entries.map(([k]) => `#${k} = :${k}`).join(', ');
    const names = Object.fromEntries(entries.map(([k]) => [`#${k}`, k]));
    const values = Object.fromEntries(entries.map(([k, v]) => [`:${k}`, v]));

    await this.client.send(new UpdateCommand({
      TableName: this.tableName,
      Key: { pk, sk },
      UpdateExpression: `SET ${expression}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
    }));
  }

  async delete(pk: string, sk: string) {
    await this.client.send(new DeleteCommand({
      TableName: this.tableName,
      Key: { pk, sk },
    }));
  }

  async scan() {
    const result = await this.client.send(new ScanCommand({
      TableName: this.tableName,
    }));
    return result.Items ?? [];
  }
}
