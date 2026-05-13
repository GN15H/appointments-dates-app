import { Injectable } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service';
import { User } from './entities/user.entity';
// import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private dynamo: DynamoService) { }

  async findOrCreate(cognitoUser: any): Promise<User> {
    const id = cognitoUser.sub;
    const existing = await this.dynamo.get(`USER#${id}`, 'PROFILE');

    if (existing) return existing as User;

    const user: User = {
      id,
      email: cognitoUser.email,
      name: cognitoUser.given_name ?? 'Unknown',
      role: 'client',
      createdAt: new Date().toISOString(),
    };

    await this.dynamo.put({
      pk: `USER#${id}`,
      sk: 'PROFILE',
      ...user,
    });

    return user;
  }

  // async httpCreate(user: CreateUserDto): Promise<User> {
  //   const id = cognitoUser.sub;
  //   const existing = await this.dynamo.get(`USER#${id}`, 'PROFILE');
  //
  //   if (existing) return existing as User;
  //
  //   const user: User = {
  //     id,
  //     email: cognitoUser.email,
  //     name: cognitoUser.name ?? 'Unknown',
  //     role: 'client',
  //     createdAt: new Date().toISOString(),
  //   };
  //
  //   await this.dynamo.put({
  //     pk: `USER#${id}`,
  //     sk: 'PROFILE',
  //     ...user,
  //   });
  //
  //   return user;
  // }

  async findById(id: string): Promise<User | null> {
    const item = await this.dynamo.get(`USER#${id}`, 'PROFILE');
    return item as User ?? null;
  }
}
