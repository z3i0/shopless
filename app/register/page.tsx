"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { registerSimulated, isLoading } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (!agreedToTerms) {
      setErrorMessage('You must agree to the Terms of Service to continue');
      return;
    }

    const success = await registerSimulated({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
    });

    if (success) {
      router.push('/account');
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xl shadow-xs">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create Your Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Join Shopless to track orders, save wishlists, and get exclusive promo codes.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-semibold">
              Full Name
            </Label>
            <div className="relative">
              <Input
                id="fullName"
                type="text"
                placeholder="Emily Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-9 text-xs"
                disabled={isLoading}
                required
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Email Address
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="emily@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 text-xs"
                disabled={isLoading}
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 text-xs"
                disabled={isLoading}
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-9 text-xs"
                disabled={isLoading}
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(Boolean(checked))}
            />
            <Label htmlFor="terms" className="text-xs font-normal leading-tight cursor-pointer">
              I agree to the Shopless Terms of Service and Privacy Policy.
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 text-xs font-bold gap-2 rounded-xl mt-2"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
