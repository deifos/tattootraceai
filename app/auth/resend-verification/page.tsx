import { ResendVerificationForm } from '@/components/auth/resend-verification-form';
import { AuthBackground } from '@/components/auth-background';

export default function ResendVerificationPage() {
  return (
    <AuthBackground>
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='w-full max-w-4xl'>
          <ResendVerificationForm />
        </div>
      </div>
    </AuthBackground>
  );
}
