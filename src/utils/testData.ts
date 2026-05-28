import { Booking } from '../types/booking';

export function generateBooking(overrides?: Partial<Booking>): Booking {
  return {
    firstname: 'James',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2026-01-01',
      checkout: '2026-02-01',
    },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}

export const INVALID_BOOKING_PAYLOADS = [
  {},
  { firstname: null },
  { totalprice: 'not-a-number' },
  { bookingdates: {} },
  { firstname: '', lastname: '', totalprice: 0 },
];
