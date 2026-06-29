/**
 * Example: Error handling
 *
 * This example demonstrates proper error handling with the SDK's custom error classes.
 */

import {
  CommerceClient,
  CommerceAPIError,
  CommerceValidationError,
  CommerceNetworkError,
  CommerceAuthenticationError,
  CommerceRateLimitError,
} from '../src';

async function main() {
  // Initialize with potentially invalid API key
  const commerce = new CommerceClient({
    apiKey: process.env.ZEBO_API_KEY || 'invalid-key',
    timeout: 5000, // Short timeout for testing
    debug: true,
  });

  // Example 1: Handling validation errors
  console.log('Example 1: Validation Error');
  try {
    await commerce.orders.create({
      // Missing required fields - will throw validation error
      line_items: [],
    } as any);
  } catch (error) {
    if (error instanceof CommerceValidationError) {
      console.error('❌ Validation Error:');
      console.error('  Message:', error.message);
      console.error('  Status Code:', error.statusCode);
      console.error('  Type:', error.type);
      console.error('  Cause:', error.cause);
      console.error('  Fix:', error.fixCode);
      console.error('  Detail:', error.detail);
      console.error('  Docs:', error.url);
    } else {
      console.error('Unexpected error:', error);
    }
  }

  // Example 2: Handling authentication errors
  console.log('\n\nExample 2: Authentication Error');
  try {
    await commerce.orders.lookup({
      order_id: 'or_123',
    });
  } catch (error) {
    if (error instanceof CommerceAuthenticationError) {
      console.error('❌ Authentication Error:');
      console.error('  Message:', error.message);
      console.error('  Status Code:', error.statusCode);
      console.error('  💡 Tip: Check your API key in the configuration');
    } else if (error instanceof CommerceAPIError) {
      console.error('❌ API Error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }

  // Example 3: Handling rate limit errors
  console.log('\n\nExample 3: Rate Limit Handling');
  try {
    // Make multiple rapid requests to trigger rate limiting
    const requests = Array.from({ length: 100 }, (_, i) =>
      commerce.orders.lookup({ order_id: `or_${i}` })
    );
    await Promise.all(requests);
  } catch (error) {
    if (error instanceof CommerceRateLimitError) {
      console.error('❌ Rate Limit Error:');
      console.error('  Message:', error.message);
      console.error('  Retry After:', error.retryAfter, 'seconds');
      console.error('  💡 Tip: Wait before making more requests');

      if (error.retryAfter) {
        console.log(`  Waiting ${error.retryAfter} seconds before retrying...`);
        // In a real app, you'd actually wait and retry
      }
    } else if (error instanceof CommerceAPIError) {
      console.error('❌ API Error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }

  // Example 4: Handling network errors
  console.log('\n\nExample 4: Network Error');
  const slowCommerce = new CommerceClient({
    apiKey: 'test-key',
    baseUrl: 'https://nonexistent-api.example.com',
    timeout: 1000, // Very short timeout
  });

  try {
    await slowCommerce.orders.lookup({
      order_id: 'or_123',
    });
  } catch (error) {
    if (error instanceof CommerceNetworkError) {
      console.error('❌ Network Error:');
      console.error('  Message:', error.message);
      console.error('  Is Timeout:', error.isTimeout);
      console.error('  Cause:', error.cause?.message);
      console.error('  💡 Tip: Check your network connection or increase timeout');
    } else {
      console.error('Unexpected error:', error);
    }
  }

  // Example 5: Generic error handling pattern
  console.log('\n\nExample 5: Generic Error Handling Pattern');
  async function safeOrderCreate() {
    try {
      return await commerce.orders.create({
        customer_data: {
          name: 'Test User',
          email_address: 'test@example.com',
          phone_number: '0559714200',
        },
        line_items: [
          {
            type: 'product',
            product: {
              type: 'physical',
              quantity: 1,
              name: 'Test Product',
              price: { currency: 'ghs', value: 10000 },
            },
          },
        ],
        billing_details: {
          email_address: 'test@example.com',
          phone_number: '0559714200',
          name: 'Test User',
          address: {
            name: 'Test User',
            phone_number: '0559714200',
            line1: '123 Test St',
            town: 'Accra',
            region: 'Greater Accra',
            country: 'GH',
          },
        },
      });
    } catch (error) {
      // Comprehensive error handling
      if (error instanceof CommerceValidationError) {
        console.error('Validation failed:', error.message);
        // Handle validation errors (e.g., show user-friendly message)
      } else if (error instanceof CommerceAuthenticationError) {
        console.error('Authentication failed - check API key');
        // Handle auth errors (e.g., redirect to login)
      } else if (error instanceof CommerceRateLimitError) {
        console.error('Rate limited - retry after', error.retryAfter, 'seconds');
        // Handle rate limiting (e.g., queue request for later)
      } else if (error instanceof CommerceNetworkError) {
        console.error('Network error:', error.message);
        // Handle network errors (e.g., show offline message)
      } else if (error instanceof CommerceAPIError) {
        console.error('API error:', error.statusCode, error.message);
        // Handle general API errors
      } else {
        console.error('Unexpected error:', error);
        // Handle unexpected errors
      }
      throw error;
    }
  }

  await safeOrderCreate();
}

// Run the example
if (require.main === module) {
  main().catch((error) => {
    console.error('\nFinal error:', error.message);
    process.exit(1);
  });
}

export default main;
