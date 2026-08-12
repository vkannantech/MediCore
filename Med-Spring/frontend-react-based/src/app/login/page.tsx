'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Activity } from 'lucide-react';
import { login } from '@/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-ocean-100 text-ocean-600 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Welcome Back</h1>
            <p className="text-neutral-500 mt-1">Sign in to your MediCore account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="p-3 rounded-lg bg-error-light text-error-dark text-sm border border-error-light/50">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-6" isLoading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <button onClick={() => router.push('/register')} className="text-ocean-600 font-semibold hover:underline">
              Create one
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
