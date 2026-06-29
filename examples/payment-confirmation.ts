/**
 * Example: Payment confirmation flow
 *
 * This example demonstrates the complete payment confirmation flow including
 * OTP verification and resending confirmation codes.
 */

import { CommerceClient } from '../src';
import * as readline from 'readline';

// Helper function to prompt for user input
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  // Initialize the SDK
  const commerce = new CommerceClient({
    apiKey: process.env.ZEBO_API_KEY || 'your-api-key',
    debug: true,
  });

  try {
    // Assume we have an order ID that requires payment confirmation
    // In a real scenario, this would come from a previous step
    const orderId = process.env.ORDER_ID || 'or_example_123';

    console.log('Starting payment confirmation flow for order:', orderId);

    // Step 1: Request confirmation code
    console.log('\nRequesting confirmation code...');
    const requestResult = await commerce.orders.requestConfirmation({
      order_id: orderId,
    });

    console.log('✅', requestResult.message);

    // Step 2: Prompt user for OTP
    console.log('\n📱 Please check your phone for the confirmation code (OTP)');
    const otp = await prompt('Enter the confirmation code: ');

    // Step 3: Confirm payment with OTP
    console.log('\nConfirming payment...');
    const confirmResult = await commerce.orders.confirmPayment({
      order_id: orderId,
      token: otp.trim(),
    });

    if (confirmResult.success) {
      console.log('✅ Payment confirmed successfully!');
      console.log('Order Status:', confirmResult.order.status);
      console.log('Payment Status:', confirmResult.order.payment_status);
      console.log('Paid At:', confirmResult.order.paid_at);

      // Check if order is fully paid
      if (confirmResult.order.payment_status === 'succeeded') {
        console.log('\n🎉 Order is fully paid and completed!');
      }
    } else {
      console.log('❌ Payment confirmation failed');
      console.log('Please verify the confirmation code and try again');

      // Optionally, prompt to resend OTP
      const resend = await prompt('\nWould you like to resend the confirmation code? (y/n): ');

      if (resend.toLowerCase() === 'y') {
        const resendResult = await commerce.orders.requestConfirmation({
          order_id: orderId,
        });
        console.log('✅', resendResult.message);
      }
    }
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

