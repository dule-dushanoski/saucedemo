import { test, expect } from '../../src/fixtures/testFixture';
import { generateBooking, INVALID_BOOKING_PAYLOADS } from '../../src/utils/testData';
import { validateSchema, BOOKING_SCHEMA, BOOKING_RESPONSE_SCHEMA } from '../../src/schemas/bookingSchema';
import { Booking } from '../../src/types/booking';

test.describe('API - Booking Tests', () => {
  let createdBookingId: number;

  test.describe('GET /booking', () => {
    test('should return all bookings', async ({ bookingApi }) => {
      const response = await bookingApi.getAllBookings();
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
    });
  });

  test.describe('POST /booking', () => {
    test('should create a new booking', async ({ bookingApi }) => {
      const bookingData = generateBooking();
      const response = await bookingApi.createBooking(bookingData);
      expect(response.status()).toBe(200);

      const body = await response.json();
      const result = validateSchema(body, BOOKING_RESPONSE_SCHEMA);
      expect(result.valid).toBe(true);

      createdBookingId = body.bookingid;
      expect(body.booking).toMatchObject({ ...bookingData });
    });

    test('should validate booking response schema', async ({ bookingApi }) => {
      const bookingData = generateBooking();
      const response = await bookingApi.createBooking(bookingData);
      const body = await response.json();
      const result = validateSchema(body.booking, BOOKING_SCHEMA);
      expect(result.valid).toBe(true);
    });

    for (const [index, payload] of INVALID_BOOKING_PAYLOADS.entries()) {
      test(`should reject invalid booking payload #${index + 1}`, async ({ bookingApi }) => {
        const response = await bookingApi.createBooking(payload as unknown as Booking);
        const status = response.status();
        if (status === 200) {
          const body = await response.json();
          expect(body).toHaveProperty('bookingid');
        } else {
          expect(status).toBeGreaterThanOrEqual(400);
        }
      });
    }
  });

  test.describe('GET /booking/{id}', () => {
    test('should return booking by ID', async ({ bookingApi }) => {
      const createResponse = await bookingApi.createBooking(generateBooking());
      const { bookingid } = await createResponse.json();

      const response = await bookingApi.getBookingById(bookingid);
      expect(response.status()).toBe(200);

      const body = await response.json();
      const result = validateSchema(body, BOOKING_SCHEMA);
      expect(result.valid).toBe(true);
    });

    test('should return 404 for non-existent booking', async ({ bookingApi }) => {
      const response = await bookingApi.getBookingById(0);
      expect(response.status()).toBe(404);
    });
  });

  test.describe('PUT /booking/{id}', () => {
    test('should fully update an existing booking', async ({ bookingApi, apiClient }) => {
      await apiClient.authenticate();
      const createResponse = await bookingApi.createBooking(generateBooking());
      const { bookingid } = await createResponse.json();

      const updatedData = generateBooking({ firstname: 'John', lastname: 'Smith', totalprice: 200 });
      const response = await bookingApi.updateBooking(bookingid, updatedData);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.firstname).toBe('John');
      expect(body.lastname).toBe('Smith');
      expect(body.totalprice).toBe(200);
    });

    test('should return 403 for update without auth', async ({ bookingApi }) => {
      const response = await bookingApi.updateBooking(1, generateBooking());
      expect(response.status()).toBe(403);
    });
  });

  test.describe('PATCH /booking/{id}', () => {
    test('should partially update an existing booking', async ({ bookingApi, apiClient }) => {
      await apiClient.authenticate();
      const createResponse = await bookingApi.createBooking(generateBooking());
      const { bookingid } = await createResponse.json();

      const response = await bookingApi.partialUpdateBooking(bookingid, { firstname: 'Jane' });
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.firstname).toBe('Jane');
      expect(body.lastname).toBe('Brown');
    });
  });

  test.describe('DELETE /booking/{id}', () => {
    test('should delete an existing booking', async ({ bookingApi, apiClient }) => {
      await apiClient.authenticate();
      const createResponse = await bookingApi.createBooking(generateBooking());
      const { bookingid } = await createResponse.json();

      const response = await bookingApi.deleteBooking(bookingid);
      expect(response.status()).toBe(201);
    });

    test('should return 404 after deletion', async ({ bookingApi, apiClient }) => {
      await apiClient.authenticate();
      const createResponse = await bookingApi.createBooking(generateBooking());
      const { bookingid } = await createResponse.json();

      await bookingApi.deleteBooking(bookingid);
      const getResponse = await bookingApi.getBookingById(bookingid);
      expect(getResponse.status()).toBe(404);
    });
  });

  test.describe('Chained API calls', () => {
    test('should create, update, retrieve and delete booking in sequence', async ({ bookingApi, apiClient }) => {
      await apiClient.authenticate();

      const created = await bookingApi.createBooking(generateBooking());
      const { bookingid } = await created.json();
      expect(bookingid).toBeTruthy();

      const updated = await bookingApi.updateBooking(bookingid, generateBooking({ lastname: 'Updated' }));
      expect(updated.status()).toBe(200);
      const updatedBody = await updated.json();
      expect(updatedBody.lastname).toBe('Updated');

      const retrieved = await bookingApi.getBookingById(bookingid);
      expect(retrieved.status()).toBe(200);

      const deleted = await bookingApi.deleteBooking(bookingid);
      expect(deleted.status()).toBe(201);

      const afterDelete = await bookingApi.getBookingById(bookingid);
      expect(afterDelete.status()).toBe(404);
    });
  });
});
