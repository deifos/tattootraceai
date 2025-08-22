"use client";

import { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Card, CardBody } from '@heroui/card';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useSession } from '@/lib/auth-client';
import getStripe from '@/lib/get-stripe';
import { CRAZY_INK_PACK } from '@/config/pricing';

interface PricingTableProps {
  variant?: 'modal' | 'section';
  className?: string;
}

export function PricingTable({ variant = 'section', className = '' }: PricingTableProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProceedToCheckout = async () => {
    // Check if user is authenticated
    if (!session?.user) {
      router.push('/auth/sign-in');
      return;
    }

    setLoading(true);

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
      console.error('Checkout error:', err);
      // You could add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const isModalVariant = variant === 'modal';

  return (
    <Card className={`bg-gradient-to-br from-background to-content1 border border-divider rounded-2xl shadow-sm ${className}`}>
      <CardBody className={`${isModalVariant ? 'p-8 flex flex-col items-center' : 'p-6 sm:p-8 text-center'}`}>
        <div className="mb-6">
          <h3 className={`font-bold text-foreground mb-2 ${isModalVariant ? 'text-2xl' : 'text-xl sm:text-2xl'}`}>
            {CRAZY_INK_PACK.name}
          </h3>
          <Chip 
            color="success"
            variant="flat"
            className="text-xs whitespace-nowrap"
          >
            No monthly payments
          </Chip>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1 justify-center">
            <span className={`font-bold text-foreground ${isModalVariant ? 'text-6xl' : 'text-4xl sm:text-6xl'}`}>
              ${CRAZY_INK_PACK.price}
            </span>
          </div>
          <p className="text-foreground/70 mt-1">One-time purchase</p>
        </div>

        {/* Description */}
        <p className="text-foreground/80 mb-8">Perfect for exploring AI tattoo designs</p>

        {/* Features List */}
        <div className={`space-y-4 mb-8 ${isModalVariant ? 'flex flex-col items-center' : ''}`}>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-foreground/80">{CRAZY_INK_PACK.credits} AI generations</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-foreground/80">Tattoo design creation</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-foreground/80">Photo tattoo overlay</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-foreground/80">Multiple art styles</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          color="primary"
          size="lg"
          className="rounded-xl font-semibold px-12 py-3"
          onPress={handleProceedToCheckout}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : mounted && session?.user ? (
            'Get started'
          ) : (
            'Sign in to purchase'
          )}
        </Button>
      </CardBody>
    </Card>
  );
}
