import { BookingsService } from "./bookings.service";
import { DynamoService } from '../dynamo/dynamo.service';
import { Test, TestingModule } from "@nestjs/testing";
import { Booking } from "./entities/booking.entity";

describe('BookingsService', () => {
  let service: BookingsService;
  let dynamoService: DynamoService;

  const mockDynamoService = {
    query: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: DynamoService,
          useValue: mockDynamoService
        }
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    dynamoService = module.get<DynamoService>(DynamoService)
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('findByUser', () => {
    it('Should return an array of bookings', async () => {
      const mockBookings = [{
        pk: 'USER#1',
        sk: 'BOOKING#2020-02-04#10:00',
        id: '1',
        userId: '1',
        date: '2020-02-04',
        timeSlot: '10:00',
        status: 'confirmed',
        createdAt: "2020-02-02:20-20-20.000"
      }]
      mockDynamoService.query.mockResolvedValue(mockBookings);

      const result: Booking[] = await service.findByUser('1');
      expect(result).toEqual(mockBookings);
      expect(dynamoService.query).toHaveBeenCalledWith('USER#1', 'BOOKING#')
    })
  })

});
