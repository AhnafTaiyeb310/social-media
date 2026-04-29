'use client';

import { SleekButton, SleekCard } from '@/components/ui/SleekElements';
import { getMe, verifyEmailRequest } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import { CheckCircle2, Loader, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const { key } = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const login = useAuthStore(s => s.login);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const verifyEmail = async () => {
      try {
        await verifyEmailRequest(key);
        
        // Attempt auto-login if backend session was established
        try {
          const user = await getMe();
          login(user);
          setStatus('success');
          setMessage('Email verified! You are now logged in. Redirecting...');
          toast.success('Email verified successfully! 🎉');
          setTimeout(() => router.push('/'), 2000);
        } catch {
          // Not auto-logged in, that's fine, just show success
          setStatus('success');
          setMessage('Your email has been successfully verified! You can now log in.');
          toast.success('Email verified successfully! ✅');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. The link may have expired.');
      }
    };

    if (key) {
      verifyEmail();
    }
  }, [key, login, router, mounted]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <SleekCard className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-3xl mb-2">S</div>
        </div>

        {status === 'verifying' && (
          <div className="space-y-4">
            <Loader className="w-12 h-12 text-primary animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Verifying Email</h1>
            <p className="text-gray-500">Please wait while we confirm your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Success!</h1>
            <p className="text-gray-500">{message}</p>
            <Link href="/login" className="block">
              <SleekButton className="w-full">Sign In</SleekButton>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <XCircle className="w-12 h-12 text-danger mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Verification Failed</h1>
            <p className="text-gray-500">{message}</p>
            <div className="space-y-2">
              <Link href="/signup" className="block">
                <SleekButton variant="outline" className="w-full">Back to Signup</SleekButton>
              </Link>
            </div>
          </div>
        )}
      </SleekCard>
    </div>
  );
}
