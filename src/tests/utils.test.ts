/**
 * Tests for utility functions
 */

import { describe, it, expect } from 'vitest';
import { generateIdempotencyKey } from '../utils/idempotency';
import { validateRequired, isValidEmail, isValidPhoneNumber } from '../utils/validation';

describe('Utils', () => {
  describe('generateIdempotencyKey', () => {
    it('should generate a valid UUIDv7', () => {
      const key = generateIdempotencyKey();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      expect(key).toMatch(uuidRegex);
    });

    it('should generate unique keys', () => {
      const key1 = generateIdempotencyKey();
      const key2 = generateIdempotencyKey();

      expect(key1).not.toBe(key2);
    });
  });

  describe('validateRequired', () => {
    it('should return no errors for valid object', () => {
      const errors = validateRequired(
        {
          name: 'John',
          email: 'john@example.com',
        },
        ['name', 'email']
      );

      expect(errors).toHaveLength(0);
    });

    it('should return errors for missing fields', () => {
      const errors = validateRequired(
        {
          name: 'John',
        },
        ['name', 'email']
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('email');
    });

    it('should return errors for null/empty values', () => {
      const errors = validateRequired(
        {
          name: '',
          email: null,
        },
        ['name', 'email']
      );

      expect(errors).toHaveLength(2);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhoneNumber('0559714200')).toBe(true);
      expect(isValidPhoneNumber('+233559714200')).toBe(true);
      expect(isValidPhoneNumber('055-971-4200')).toBe(true);
      expect(isValidPhoneNumber('(055) 971-4200')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('123')).toBe(false);
      expect(isValidPhoneNumber('abc')).toBe(false);
    });
  });
});
