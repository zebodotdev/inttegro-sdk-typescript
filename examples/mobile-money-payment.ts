/**
 * Example: Mobile money payment
 *
 * This example demonstrates how to create an order and pay with mobile money.
 */

import { InttegroClient } from '../src';

async function main() {
  // Initialize the SDK
  const inttegro = new InttegroClient({
    apiKey: process.env.INTTEGRO_API_KEY || 'your-api-key',
    debug: true,
  });

  try {
    // Step 1: Create an order
    console.log('Creating order...');
    const order = await inttegro.orders.create({
      customer_data: {
        name: 'Jane Smith',
        email_address: 'jane@example.com',
        phone_number: '0544998605',
      },
      line_items: [
        {
          type: 'product',
          product: {
            type: 'digital',
            quantity: 1,
            name: 'Digital Course - Web Development',
            price: {
              currency: 'ghs',
              value: 15000, // GHS 150.00
            },
          },
        },
      ],
      billing_details: {
        email_address: 'jane@example.com',
        phone_number: '0544998605',
        name: 'Jane Smith',
        address: {
          name: 'Jane Smith',
          phone_number: '0544998605',
          line1: '789 Tech Avenue',
          town: 'Kumasi',
          region: 'Ashanti',
          country: 'GH',
        },
      },
    });

    console.log('✅ Order created:', order.id);

    // Step 2: Pay with mobile money
    console.log('\nProcessing mobile money payment...');
    const paidOrder = await inttegro.orders.pay({
      order_id: order.id,
      payment_method_data: {
        type: 'mobile_money',
        mobile_money: {
          network: 'mtn', // MTN Mobile Money
          account_number: '0544998605',
        },
      },
    });

    console.log('✅ Payment initiated');
    console.log('Payment Status:', paidOrder.payment?.status);

    if (paidOrder.payment?.next_action?.type === 'confirm_payment') {
      console.log('\n⚠️  Payment requires confirmation (OTP)');
      console.log('Please check your phone for the OTP');

      // In a real application, you would:
      // 1. Prompt user to enter OTP
      // 2. Call confirmPayment with the OTP
      // 3. Handle the confirmation result

      // Example (with mock OTP):
      // const otp = await promptUserForOTP();
      // const confirmation = await inttegro.orders.confirmPayment({
      //   order_id: order.id,
      //   token: otp,
      // });
    } else {
      console.log('✅ Payment completed successfully!');
    }

    // Step 3: Check final order status
    const finalOrder = await inttegro.orders.lookup({
      order_id: order.id,
    });

    console.log('\n📊 Final Order Status:');
    console.log('Order Status:', finalOrder.status);
    console.log('Payment Status:', finalOrder.payment?.status);
    console.log('Paid At:', finalOrder.paid_at || 'Not yet paid');
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
