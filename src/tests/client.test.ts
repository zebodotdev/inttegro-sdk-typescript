/**
 * Tests for CommerceClient
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CommerceClient } from '../client';

describe('CommerceClient', () => {
  describe('constructor', () => {
    it('should create a client with valid config', () => {
      const client = new CommerceClient({
        apiKey: 'test_key',
      });

      expect(client).toBeDefined();
      expect(client.orders).toBeDefined();
      expect(client.apps).toBeDefined();
      expect(client.keys).toBeDefined();
      expect(client.purchaseIntents).toBeDefined();
      expect(client.fileReferences).toBeDefined();
    });

    it('should throw error when API key is missing', () => {
      expect(() => {
        new CommerceClient({
          apiKey: '',
        });
      }).toThrow('API key is required');
    });

    it('should accept custom configuration', () => {
      const client = new CommerceClient({
        apiKey: 'test_key',
        baseUrl: 'https://custom.api.com',
        timeout: 60000,
        debug: true,
      });

      expect(client).toBeDefined();
    });
  });

  describe('updateConfig', () => {
    let client: CommerceClient;

    beforeEach(() => {
      client = new CommerceClient({
        apiKey: 'test_key',
      });
    });

    it('should update config', () => {
      expect(() => {
        client.updateConfig({
          timeout: 45000,
          debug: true,
        });
      }).not.toThrow();
    });
  });

  describe('interceptors', () => {
    let client: CommerceClient;

    beforeEach(() => {
      client = new CommerceClient({
        apiKey: 'test_key',
      });
    });

    it('should add request interceptor', () => {
      expect(() => {
        client.addRequestInterceptor((url, options) => {
          return { url, options };
        });
      }).not.toThrow();
    });

    it('should add response interceptor', () => {
      expect(() => {
        client.addResponseInterceptor((response) => {
          return response;
        });
      }).not.toThrow();
    });
  });
});
