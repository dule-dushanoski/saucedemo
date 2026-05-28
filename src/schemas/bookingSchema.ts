export const BOOKING_SCHEMA = {
  type: 'object',
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    totalprice: { type: 'number' },
    depositpaid: { type: 'boolean' },
    bookingdates: {
      type: 'object',
      required: ['checkin', 'checkout'],
      properties: {
        checkin: { type: 'string' },
        checkout: { type: 'string' },
      },
    },
    additionalneeds: { type: 'string' },
  },
};

export const BOOKING_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['bookingid', 'booking'],
  properties: {
    bookingid: { type: 'number' },
    booking: BOOKING_SCHEMA,
  },
};

export const AUTH_RESPONSE_SCHEMA = {
  type: 'object',
  required: ['token'],
  properties: {
    token: { type: 'string' },
  },
};

export function validateSchema(data: unknown, schema: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Response is not an object'] };
  }

  const obj = data as { [key: string]: unknown };
  const required = schema.required as string[];

  for (const field of required) {
    if (!(field in obj)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  const props = schema.properties as { [key: string]: Record<string, unknown> };
  for (const [key, value] of Object.entries(props)) {
    if (key in obj && obj[key] !== null && obj[key] !== undefined) {
      const propSchema = value;
      if (propSchema.type === 'object' && propSchema.properties) {
        const nested = validateSchema(obj[key], propSchema);
        errors.push(...nested.errors.map((e) => `${key}.${e}`));
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
