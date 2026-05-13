import { Injectable, ConflictException } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service';
import { Booking } from './entities/booking.entity';
import { CreateBookingInput } from './dto/create-booking.input';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingsService {
  constructor(private dynamo: DynamoService) { }

  async create(userId: string, input: CreateBookingInput): Promise<Booking> {
    const existing = await this.dynamo.query(
      `SERVICE#${input.serviceId}`,
      `BOOKING#${input.date}#${input.timeSlot}`,
    );

    if (existing.length > 0) {
      throw new ConflictException('That time slot is already booked');
    }

    const id = uuidv4();
    const booking: Booking = {
      id,
      userId,
      serviceId: input.serviceId,
      date: input.date,
      timeSlot: input.timeSlot,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    await this.dynamo.put({
      pk: `USER#${userId}`,
      sk: `BOOKING#${input.date}#${input.timeSlot}#${id}`,
      ...booking,
    });

    await this.dynamo.put({
      pk: `SERVICE#${input.serviceId}`,
      sk: `BOOKING#${input.date}#${input.timeSlot}`,
      ...booking,
    });

    return booking;
  }

  async findByUser(userId: string): Promise<Booking[]> {
    const items = await this.dynamo.query(`USER#${userId}`, 'BOOKING#');
    console.log('what?', items);
    return items as Booking[];
  }

  async cancel(userId: string, bookingId: string, date: string, timeSlot: string): Promise<Booking> {
    await this.dynamo.update(
      `USER#${userId}`,
      `BOOKING#${date}#${timeSlot}#${bookingId}`,
      { status: 'cancelled' },
    );

    const item = await this.dynamo.get(
      `USER#${userId}`,
      `BOOKING#${date}#${timeSlot}#${bookingId}`,
    );

    return item as Booking;
  }
}
