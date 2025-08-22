import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { AuthBackground } from '@/components/auth-background';

export default function ForgotPasswordPage() {
  return (
    <AuthBackground>
      <div className='flex min-h-screen flex-col items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-sm md:max-w-3xl relative'>
          <ForgotPasswordForm />
        </div>
      </div>
    </AuthBackground>
  );
}
