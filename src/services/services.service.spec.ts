import { Test, TestingModule } from '@nestjs/testing';
import { Service } from './entities/service.entity';
import { ServicesService } from './services.service';
import { DynamoService } from '../dynamo/dynamo.service';

describe('ServicesService', () => {
  let service: ServicesService;
  let dynamoService: DynamoService;

  const mockDynamoService = {
    scan: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: DynamoService,
          useValue: mockDynamoService
        }
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    dynamoService = module.get<DynamoService>(DynamoService)
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('findAll', () => {
    it('Should return an array of services', async () => {
      const mockServices = [{
        pk: 'SERVICE#1', sk: 'META', id: '1', name: 'servi', description: 'descrip', price: 69, durationMinutes: 20, createdAt: "2020-02-02:20-20-20.000"
      }]
      mockDynamoService.scan.mockResolvedValue(mockServices);

      const result: Service[] = await service.findAll();
      expect(result).toEqual(mockServices);
      expect(dynamoService.scan).toHaveBeenCalledWith()
    })
  })

});
