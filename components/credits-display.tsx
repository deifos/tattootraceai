'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';

import { useCreditsStore } from '@/lib/credits-store';
import { usePricingModal } from './pricing-modal';

interface CreditsDisplayProps {
  userId: string;
  compact?: boolean;
}

export function CreditsDisplay({
  userId,
  compact = false,
}: CreditsDisplayProps) {
  const { creditInfo, fetchCredits } = useCreditsStore();
  const { onOpen, PricingModal } = usePricingModal();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCredits = async () => {
      if (creditInfo === null) {
        await fetchCredits();
      }
      setLoading(false);
    };

    loadCredits();
  }, [userId, creditInfo, fetchCredits]);

  if (loading) {
    const loadingContent = compact ? (
      <div className='flex items-center gap-2 px-3 py-1 bg-default-100 rounded-full'>
        <div className='animate-pulse'>
          <div className='h-3 bg-default-300 rounded w-16' />
        </div>
      </div>
    ) : (
      <Card className='w-full'>
        <CardBody className='text-center'>
          <div className='animate-pulse'>
            <div className='h-4 bg-default-200 rounded w-24 mx-auto' />
          </div>
        </CardBody>
      </Card>
    );
    
    return (
      <>
        {loadingContent}
        <PricingModal />
      </>
    );
  }

  const content = compact ? (
    <div className='flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-full'>
      {/* Credits label and value: hide on mobile if zero credits to avoid overflow */}
      <div
        className={
          (creditInfo === null || creditInfo?.total === 0)
            ? 'hidden sm:flex items-center gap-2'
            : 'flex items-center gap-2'
        }
      >
        <span className='text-xs text-default-600'>Credits:</span>
        <div className='flex items-center gap-1'>
          <span className='text-sm font-bold text-primary'>
            {creditInfo?.total ?? 0}
          </span>
        </div>
      </div>
      {(creditInfo === null || creditInfo?.total === 0) && (
        <Button
          className='ml-0 sm:ml-2 h-6 px-2 text-xs'
          color='primary'
          onPress={onOpen}
          size='sm'
          variant='flat'
        >
          Buy
        </Button>
      )}
    </div>
  ) : (
    <Card className='w-full bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200'>
      <CardBody className='text-center'>
        {creditInfo === null || creditInfo?.total === 0 ? (
          <div className='flex items-center justify-between'>
            <div className='text-left'>
              <p className='text-sm text-default-600'>Available Credits</p>
              <p className='text-2xl font-bold text-primary'>
                {creditInfo?.total ?? '0'}
              </p>
            </div>
            <Button
              color='primary'
              onPress={onOpen}
              size='sm'
              variant='flat'
            >
              Buy Credits
            </Button>
          </div>
        ) : (
          <div className='text-center'>
            <p className='text-sm text-default-600'>Available Credits</p>
            <p className='text-3xl font-bold text-primary mb-2'>
              {creditInfo?.total ?? 0}
            </p>
            {creditInfo && creditInfo.freeCredits > 0 && (
              <div className='flex justify-center items-center gap-3 mb-2'>
                <div className='text-center'>
                  <p className='text-xs text-success font-medium'>
                    {creditInfo.freeCredits} free credits remaining
                  </p>
                </div>
              </div>
            )}
            <p className='text-xs text-default-500'>
              Each generation uses 1 credit
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );

  return (
    <>
      {content}
      <PricingModal />
    </>
  );
}
