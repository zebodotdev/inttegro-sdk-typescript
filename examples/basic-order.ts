/**
 * Example: Creating a basic order
 *
 * This example demonstrates how to create a simple order with a new customer.
 */

import { CommerceClient } from '../src';

async function main() {
  // Initialize the SDK
  const commerce = new CommerceClient({
    apiKey: process.env.ZEBO_API_KEY || 'your-api-key',
    debug: true, // Enable debug logging
  });

  try {
    // Create a new order
    const result = await commerce.orders.create({
      customer_data: {
        name: 'John Doe',
        email_address: 'john@example.com',
        phone_number: '0559714200',
        reference: 'customer-ref-123',
        custom_data: {
          source: 'web',
          campaign: 'summer-sale',
        },
      },
      line_items: [
        {
          type: 'product',
          product: {
            type: 'physical',
            quantity: 2,
            name: 'Premium Widget',
            about: 'High-quality widget for professionals',
            reference: 'WIDGET-001',
            price: {
              currency: 'ghs',
              value: 20000, // GHS 200.00
            },
            custom_data: {
              sku: 'WIDGET-001',
              category: 'electronics',
            },
          },
        },
        {
          type: 'fee',
          fee: {
            amount: {
              currency: 'ghs',
              value: 1000, // GHS 10.00 processing fee
            },
            description: 'Processing fee',
          },
        },
      ],
      billing_details: {
        email_address: 'john@example.com',
        phone_number: '0559714200',
        name: 'John Doe',
        address: {
          name: 'John Doe',
          phone_number: '0559714200',
          line1: '123 Main Street',
          line2: 'Apt 4B',
          town: 'Accra',
          region: 'Greater Accra',
          country: 'GH',
          post_code: '00233',
        },
      },
      shipping: {
        address: {
          name: 'John Doe',
          phone_number: '0559714200',
          line1: '456 Delivery Street',
          town: 'Accra',
          region: 'Greater Accra',
          country: 'GH',
        },
      },
      number: `ORD-${Date.now()}`, // Custom order number
      statement_descriptor: 'MYSHOP*ORDER',
      execute_payment: false, // Don't execute payment immediately
      redirect_url: 'https://myapp.com/order-confirmation',
    });

    console.log('✅ Order created successfully!');
    console.log('Order ID:', result.order.id);
    console.log('Order Number:', result.order.number);
    console.log('Status:', result.order.status);
    console.log('Payment Status:', result.order.payment_status);
    console.log('Total:', `GHS ${result.order.total.value / 100}`);

    if (result.redirect_url) {
      console.log('Redirect URL:', result.redirect_url);
    }

    // Lookup the order to verify
    const orderDetails = await commerce.orders.lookup({
      order_id: result.order.id,
    });

    console.log('\n✅ Order lookup successful!');
    console.log('Order Status:', orderDetails.order.status);
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

export default main;
