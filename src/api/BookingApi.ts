import { APIResponse } from '@playwright/test';
import { ApiClient } from './ApiClient';
import { Booking, BookingPartial } from '../types/booking';

export class BookingApi {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  async getAllBookings(): Promise<APIResponse> {
    return await this.client.get('/booking');
  }

  async getBookingById(id: number): Promise<APIResponse> {
    return await this.client.get(`/booking/${id}`);
  }

  async createBooking(bookingData: Booking): Promise<APIResponse> {
    return await this.client.post('/booking', bookingData);
  }

  async updateBooking(id: number, bookingData: Booking): Promise<APIResponse> {
    return await this.client.put(`/booking/${id}`, bookingData);
  }

  async partialUpdateBooking(id: number, partialData: BookingPartial): Promise<APIResponse> {
    return await this.client.patch(`/booking/${id}`, partialData);
  }

  async deleteBooking(id: number): Promise<APIResponse> {
    return await this.client.delete(`/booking/${id}`);
  }
}
