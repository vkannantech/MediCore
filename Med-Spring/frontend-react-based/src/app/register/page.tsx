'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Activity } from 'lucide-react';
import { register } from '@/services/authService';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'PATIENT',
    specialty: '', // For doctors
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 py-12">
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
            <h1 className="text-2xl font-bold text-neutral-900">Create Account</h1>
            <p className="text-neutral-500 mt-1">Join the MediCore ecosystem</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
            <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
            
            <div className="flex flex-col w-full">
              <label className="label-base">Account Type</label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                className="input-base bg-white"
              >
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
              </select>
            </div>

            {formData.role === 'DOCTOR' && (
              <Input label="Specialty" name="specialty" value={formData.specialty} onChange={handleChange} required />
            )}

            {error && (
              <div className="p-3 rounded-lg bg-error-light text-error-dark text-sm border border-error-light/50">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-6" isLoading={loading}>
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <button onClick={() => router.push('/login')} className="text-ocean-600 font-semibold hover:underline">
              Sign in
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
