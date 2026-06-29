/**
 * Tests for error classes
 */

import { describe, it, expect } from 'vitest';
import {
  CommerceAPIError,
  CommerceValidationError,
  CommerceNetworkError,
  CommerceAuthenticationError,
  CommerceRateLimitError,
} from '../errors';

describe('Errors', () => {
  describe('CommerceAPIError', () => {
    it('should create an error with all parameters', () => {
      const error = new CommerceAPIError(
        'Test error',
        400,
        'test_code',
        'test_type',
        'https://commerce.zebo.dev/e/test_code',
        'More details',
        'change_request_parameters',
        'validation_failure'
      );

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('test_code');
      expect(error.type).toBe('test_type');
      expect(error.url).toBe('https://commerce.zebo.dev/e/test_code');
      expect(error.detail).toBe('More details');
      expect(error.fixCode).toBe('change_request_parameters');
      expect(error.cause).toBe('validation_failure');
      expect(error.name).toBe('CommerceAPIError');
    });

    it('should create error from response - validation error', () => {
      const error = CommerceAPIError.fromResponse(400, {
        error: {
          message: 'Invalid payment method',
          code: 'invalid_payment_method',
          type: 'invalid_request_parameter',
          url: 'https://commerce.zebo.dev/e/invalid_payment_method',
          detail: 'Payment method not supported for this currency.',
          fix_code: 'change_request_parameters',
          cause: 'validation_failure',
        },
      });

      expect(error).toBeInstanceOf(CommerceValidationError);
      expect(error.message).toBe('Invalid payment method');
      expect(error.code).toBe('invalid_payment_method');
      expect(error.statusCode).toBe(400);
    });

    it('should create error from response - server error', () => {
      const error = CommerceAPIError.fromResponse(500, {
        message: 'Internal server error',
      });

      expect(error).toBeInstanceOf(CommerceAPIError);
      expect(error.message).toBe('Internal server error');
      expect(error.statusCode).toBe(500);
    });
  });

  describe('CommerceValidationError', () => {
    it('should create a validation error', () => {
      const error = new CommerceValidationError('Validation failed', 422);

      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(422);
      expect(error.name).toBe('CommerceValidationError');
    });
  });

  describe('CommerceNetworkError', () => {
    it('should create a network error', () => {
      const cause = new Error('Connection failed');
      const error = new CommerceNetworkError('Network error', cause);

      expect(error.message).toBe('Network error');
      expect(error.cause).toBe(cause);
      expect(error.isTimeout).toBe(false);
      expect(error.name).toBe('CommerceNetworkError');
    });

    it('should create a timeout error', () => {
      const error = new CommerceNetworkError('Request timeout', undefined, true);

      expect(error.message).toBe('Request timeout');
      expect(error.isTimeout).toBe(true);
    });
  });

  describe('CommerceAuthenticationError', () => {
    it('should create an authentication error', () => {
      const error = new CommerceAuthenticationError('Invalid API key');

      expect(error.message).toBe('Invalid API key');
      expect(error.statusCode).toBe(401);
      expect(error.type).toBe('authentication_error');
      expect(error.name).toBe('CommerceAuthenticationError');
    });
  });

  describe('CommerceRateLimitError', () => {
    it('should create a rate limit error', () => {
      const error = new CommerceRateLimitError('Rate limit exceeded', 429, 60);

      expect(error.message).toBe('Rate limit exceeded');
      expect(error.statusCode).toBe(429);
      expect(error.retryAfter).toBe(60);
      expect(error.name).toBe('CommerceRateLimitError');
    });
  });
});
