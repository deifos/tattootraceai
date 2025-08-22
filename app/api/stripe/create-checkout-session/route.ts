import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

import { auth } from '@/lib/auth';
import { stripe, CURRENCY, formatAmountForStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { CRAZY_INK_PACK } from '@/config/pricing';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the request origin for success/cancel URLs
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL;

    // Ensure user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure user has a Stripe customer ID
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      customerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create Checkout Sessions from our Crazy Ink Pack product
    const params: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      submit_type: 'pay',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: CRAZY_INK_PACK.name,
              description: `${CRAZY_INK_PACK.credits} AI image generations`,
            },
            unit_amount: formatAmountForStripe(CRAZY_INK_PACK.price, CURRENCY), // $20.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      metadata: {
        userId: session.user.id,
        productName: CRAZY_INK_PACK.name,
        credits: CRAZY_INK_PACK.credits.toString(),
      },
    };

    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
