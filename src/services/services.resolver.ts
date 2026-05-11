import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CognitoGqlGuard } from '../auth/cognito.guard';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { CreateServiceInput } from './dto/create-service.input';

@Resolver(() => Service)
@UseGuards(CognitoGqlGuard)
export class ServicesResolver {
  constructor(private servicesService: ServicesService) { }

  @Query(() => [Service])
  async services(): Promise<Service[]> {
    return this.servicesService.findAll();
  }

  @Mutation(() => Service)
  async createService(
    @Args('input') input: CreateServiceInput,
  ): Promise<Service> {
    return this.servicesService.create(input);
  }
}
