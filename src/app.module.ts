import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { ServicesModule } from './services/services.module';
import { UsersModule } from './users/users.module';
import { DynamoModule } from './dynamo/dynamo.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    BookingsModule,
    ServicesModule,
    UsersModule,
    DynamoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
