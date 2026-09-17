"use client";

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { DEMO_USERS } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const { login, isLoading } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your username');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    const success = await login({ username: username.trim(), password, rememberMe });
    if (success) {
      router.push(redirect);
    } else {
      setErrorMessage('Invalid username or password. You can click a demo profile below.');
    }
  };

  const handleSelectDemo = async (demoUsername: string, demoPass: string) => {
    setUsername(demoUsername);
    setPassword(demoPass);
    setErrorMessage('');
    const success = await login({ username: demoUsername, password: demoPass, rememberMe: true });
    if (success) {
      router.push(redirect);
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
            Welcome Back
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access your saved orders, wishlist, and profile.
          </p>
        </div>

        {/* Demo Users Quick Selector */}
        <div className="mb-6 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-2">
            <Sparkles className="size-3.5" />
            <span>Quick 1-Click Demo Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.username}
                type="button"
                onClick={() => handleSelectDemo(demo.username, demo.password)}
                className="flex flex-col items-start rounded-lg border border-border/70 bg-card p-2 text-left transition-colors hover:border-primary hover:bg-muted"
              >
                <span className="text-xs font-bold text-foreground truncate w-full">
                  {demo.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {demo.username}
                </span>
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-xs font-semibold">
              Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="e.g. emilys"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9 text-xs"
                disabled={isLoading}
                required
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-9 text-xs"
                disabled={isLoading}
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
            />
            <Label htmlFor="remember" className="text-xs font-normal cursor-pointer">
              Remember this device
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 text-xs font-bold gap-2 rounded-xl mt-2"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="size-4" />
          </Button>
        </form>

        {/* Social Logins Visual Separator */}
        <div className="relative my-6 text-center text-xs">
          <Separator />
          <span className="relative -top-2.5 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        {/* Visual-only Social Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" type="button" className="text-xs h-9">
            Google
          </Button>
          <Button variant="outline" size="sm" type="button" className="text-xs h-9">
            GitHub
          </Button>
          <Button variant="outline" size="sm" type="button" className="text-xs h-9">
            Apple
          </Button>
        </div>

        {/* Register link */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading sign in...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
