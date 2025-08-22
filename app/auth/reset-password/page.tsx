import { Suspense } from 'react';

import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { AuthBackground } from '@/components/auth-background';

export default function ResetPasswordPage() {
  return (
    <AuthBackground>
      <div className='flex min-h-screen flex-col items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-sm md:max-w-3xl relative'>
          <Suspense fallback={<div className='text-center text-white'>Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </AuthBackground>
  );
}
