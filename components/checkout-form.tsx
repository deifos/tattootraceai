"use client";

import { useState } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Loader2, CreditCard } from 'lucide-react';

import getStripe from '@/lib/get-stripe';
import { CRAZY_INK_PACK } from '@/config/pricing';

interface CheckoutFormProps {
  className?: string;
}

export function CheckoutForm({ className }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create a Checkout Session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Checkout
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (redirectError) {
        throw new Error(redirectError.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">{CRAZY_INK_PACK.name}</h3>
          <p className="text-sm text-gray-600">
            Get {CRAZY_INK_PACK.credits} AI tattoo generations for just $20
          </p>
        </div>
      </CardHeader>
      <CardBody className="gap-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {CRAZY_INK_PACK.credits} AI Generations
          </span>
          <span className="text-2xl font-bold">${CRAZY_INK_PACK.price}.00</span>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
            <p className="text-sm text-danger-600">{error}</p>
          </div>
        )}

        <Button
          color="primary"
          size="lg"
          className="w-full"
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Buy {CRAZY_INK_PACK.name}
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Secure payment processed by Stripe
        </p>
      </CardBody>
    </Card>
  );
}