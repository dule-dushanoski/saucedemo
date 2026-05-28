import { test, expect } from '../../src/fixtures/testFixture';
import { validateSchema, AUTH_RESPONSE_SCHEMA } from '../../src/schemas/bookingSchema';

test.describe('API - Authentication Tests', () => {
  test('should successfully authenticate with valid credentials', async ({ apiClient }) => {
    const token = await apiClient.authenticate();
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
  });

  test('should return valid token schema structure', async ({ apiClient }) => {
    const response = await apiClient.post('/auth', {
      username: 'admin', password: 'password123',
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const result = validateSchema(body, AUTH_RESPONSE_SCHEMA);
    expect(result.valid).toBe(true);
  });

  test('should reject authentication with invalid credentials', async ({ apiClient }) => {
    const response = await apiClient.post('/auth', {
      username: 'invalid', password: 'invalid',
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).not.toHaveProperty('token');
  });

  test('should reject authentication with empty credentials', async ({ apiClient }) => {
    const response = await apiClient.post('/auth', {});
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).not.toHaveProperty('token');
  });
});
