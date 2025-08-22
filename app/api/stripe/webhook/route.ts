import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe requires the raw body to construct the event
export const maxDuration = 10;

export async function POST(request: NextRequest) {
  console.log('🔍 Webhook endpoint hit');
  
  if (!webhookSecret) {
    console.log('⚠️ Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 400 });
  }

  console.log(`🔑 Webhook secret configured (length: ${webhookSecret.length})`);
  console.log(`🔑 Webhook secret starts with: ${webhookSecret.substring(0, 10)}...`);

  try {
    // Get the raw request body as text (this preserves exact formatting)
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    console.log(`📝 Request body length: ${body.length}`);
    console.log(`📝 Signature header: ${signature?.substring(0, 50)}...`);

    if (!signature) {
      console.log('⚠️ Missing stripe-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      // Use the text body directly - Stripe SDK can handle string bodies
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.log(`❌ Webhook signature verification failed: ${errorMessage}`);
      
      // Try with different webhook secret if we're testing with Stripe CLI
      if (process.env.STRIPE_CLI_WEBHOOK_SECRET && webhookSecret !== process.env.STRIPE_CLI_WEBHOOK_SECRET) {
        console.log('🔄 Trying with CLI webhook secret...');
        try {
          event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_CLI_WEBHOOK_SECRET);
          console.log('✅ CLI webhook secret worked!');
        } catch (cliErr) {
          console.log('❌ CLI webhook secret also failed', cliErr);
          return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
      }
    }

    // Successfully constructed event
    console.log('✅ Webhook signature verified successfully:', event.id, event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);

    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    const { userId, productName, credits } = session.metadata || {};

    if (!userId || !productName || !credits) {
      console.error('Missing required metadata in checkout session:', {
        userId,
        productName,
        credits,
        sessionId: session.id,
      });
      return;
    }

    const creditsNum = parseInt(credits);
    if (isNaN(creditsNum) || creditsNum <= 0) {
      console.error('Invalid credits value:', credits);
      return;
    }

    // Create purchase record
    await prisma.purchase.create({
      data: {
        userId,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string || '',
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'COMPLETED',
        credits: creditsNum,
        creditsRemaining: creditsNum,
        creditsUsed: 0,
      },
    });

    // Update user's available credits
    await prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: {
          increment: creditsNum,
        },
      },
    });

    console.log(
      `✅ Purchase completed for user ${userId}: ${creditsNum} credits added (${productName})`
    );

  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  try {
    // Update purchase status if needed (backup in case webhook order varies)
    await prisma.purchase.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING',
      },
      data: {
        status: 'COMPLETED',
      },
    });

    console.log(`✅ Payment intent succeeded: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update purchase status to failed and don't grant credits
    const updatedPurchases = await prisma.purchase.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
      },
      data: {
        status: 'FAILED',
      },
    });

    console.log(`❌ Payment intent failed: ${paymentIntent.id} (${updatedPurchases.count} purchases updated)`);
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}
