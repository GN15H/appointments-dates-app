import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { DynamoService } from '../dynamo/dynamo.service';
import { Booking } from './entities/booking.entity';
import { CreateBookingInput } from './dto/create-booking.input';
import { randomUUID } from 'crypto';

@Injectable()
export class BookingsService {
  constructor(private dynamo: DynamoService) { }

  async create(userId: string, input: CreateBookingInput): Promise<Booking> {
    const existing = await this.dynamo.query(
      `SERVICE#${input.serviceId}`,
      `BOOKING#${input.date}#${input.timeSlot}`,
    );

    const active = existing.filter(i => i.status !== 'cancelled');
    if (active.length > 0) throw new ConflictException('That time slot is already booked');

    const id = randomUUID();
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
    return items as Booking[];
  }

  async cancel(userId: string, bookingId: string, date: string, timeSlot: string): Promise<Booking> {
    const userSk = `BOOKING#${date}#${timeSlot}#${bookingId}`;
    const serviceSk = `BOOKING#${date}#${timeSlot}`;

    const existing = await this.dynamo.get(`USER#${userId}`, userSk);
    if (!existing) throw new NotFoundException('Booking not found');
    if (existing.status === 'cancelled') throw new ConflictException('Booking is already cancelled');

    await Promise.all([
      this.dynamo.update(`USER#${userId}`, userSk, { status: 'cancelled' }),
      this.dynamo.update(`SERVICE#${existing.serviceId}`, serviceSk, { status: 'cancelled' }),
    ]);

    return { ...existing, status: 'cancelled' } as Booking;
  }
}
