"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-xl shadow-xs">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Reset Password
          </h1>
          <p className="text-xs text-muted-foreground">
            Enter your registered email address and we will send you a secure password reset link.
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-6 text-center py-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">Check your inbox</h3>
              <p className="text-xs text-muted-foreground">
                We sent a simulated password recovery link to <strong className="text-foreground">{email}</strong>.
              </p>
            </div>

            <Link href="/login" className="block">
              <Button className="w-full text-xs font-semibold gap-2">
                <ArrowLeft className="size-4" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs"
                  disabled={isSubmitting}
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 text-xs font-bold gap-2 rounded-xl mt-2"
            >
              {isSubmitting ? 'Sending Link...' : 'Send Reset Instructions'}
              <ArrowRight className="size-4" />
            </Button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 font-medium transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
