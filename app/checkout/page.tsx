"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  Lock,
  ShoppingBag,
  CheckCircle,
  Banknote,
} from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { useOrderStore } from '@/store/order-store';
import { formatCurrency } from '@/lib/utils/format';
import { Order, PaymentMethodType } from '@/types/order';
import {
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  PaypalIcon,
  ApplePayIcon,
} from '@/components/ui/payment-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('credit-card');

  const {
    items,
    deliveryMethod,
    setDeliveryMethod,
    getTotals,
    clearCart,
  } = useCartStore();

  const { user } = useAuthStore();
  const addOrder = useOrderStore((state) => state.addOrder);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    cardNumber: '4242 •••• •••• 4242',
    cardholderName: '',
    expiryDate: '12/28',
    cvv: '123',
    billingSameAsShipping: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    // Pre-populate if logged in
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        phone: user.phone || '+1 (555) 019-2834',
        fullName: `${user.firstName} ${user.lastName}`,
        cardholderName: `${user.firstName} ${user.lastName}`,
        address: user.address?.address || '626 Main Street',
        city: user.address?.city || 'Phoenix',
        state: user.address?.state || 'Mississippi',
        postalCode: user.address?.postalCode || '29112',
        country: user.address?.country || 'United States',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (mounted && items.length === 0 && !isOrderPlaced) {
      router.replace('/cart');
    }
  }, [mounted, items.length, isOrderPlaced, router]);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-96 bg-muted animate-pulse rounded-2xl" />
          <div className="lg:col-span-5 h-96 bg-muted animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  // Fallback while redirecting if cart is empty
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col items-center justify-center text-center">
        <p className="text-sm text-muted-foreground">Your cart is empty. Redirecting to cart...</p>
      </div>
    );
  }

  const { subtotal, discount, shipping, tax, total } = getTotals();

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.email || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State / Region is required';
    if (!formData.postalCode.trim()) errs.postalCode = 'Postal code is required';

    if (paymentMethod === 'credit-card') {
      if (!formData.cardholderName.trim()) errs.cardholderName = 'Cardholder name is required';
      if (!formData.cardNumber.trim()) errs.cardNumber = 'Card number is required';
      if (!formData.expiryDate.trim()) errs.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) errs.cvv = 'CVV code is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please complete all required checkout fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate realistic payment gateway processing
    await new Promise((r) => setTimeout(r, 1200));

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const now = new Date();
    const deliveryDays = deliveryMethod === 'express' ? 2 : 4;
    const estDelivery = new Date(now.getTime() + deliveryDays * 24 * 60 * 60 * 1000);

    const newOrder: Order = {
      id: orderId,
      date: now.toISOString(),
      estimatedDelivery: estDelivery.toISOString(),
      status: 'Processing',
      items: [...items],
      shippingAddress: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        deliveryMethod,
      },
      payment: {
        paymentMethod,
        ...(paymentMethod === 'credit-card' && {
          cardNumberMasked: '•••• •••• •••• ' + (formData.cardNumber.slice(-4) || '4242'),
          cardholderName: formData.cardholderName || formData.fullName,
        }),
        ...(paymentMethod === 'paypal' && {
          paypalEmail: formData.email,
          cardholderName: formData.fullName,
        }),
        ...(paymentMethod === 'apple-pay' && {
          cardNumberMasked: 'Apple Pay (Authorized)',
          cardholderName: formData.fullName,
        }),
        ...(paymentMethod === 'cash-on-delivery' && {
          cardholderName: formData.fullName,
        }),
      },
      subtotal,
      shipping,
      tax,
      discount,
      total,
      timeline: [
        {
          status: 'Processing',
          timestamp: now.toISOString(),
          description: 'Payment authorized and simulated order created',
        },
      ],
    };

    setIsOrderPlaced(true);
    addOrder(newOrder);
    clearCart();
    setIsSubmitting(false);

    toast.success('Order placed successfully!');
    router.push(`/account/orders/${orderId}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          <Link href="/cart" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="size-3.5" /> Back to Cart
          </Link>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Checkout
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Form: Contact, Shipping, Delivery, Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Info */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-foreground">
                1. Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`text-xs h-9 ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && <span className="text-[11px] text-destructive">{errors.email}</span>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`text-xs h-9 ${errors.phone ? 'border-destructive' : ''}`}
                  />
                  {errors.phone && <span className="text-[11px] text-destructive">{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-foreground">
                2. Shipping Address
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-semibold">
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="First and last name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`text-xs h-9 ${errors.fullName ? 'border-destructive' : ''}`}
                  />
                  {errors.fullName && <span className="text-[11px] text-destructive">{errors.fullName}</span>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs font-semibold">
                    Street Address *
                  </Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`text-xs h-9 ${errors.address ? 'border-destructive' : ''}`}
                  />
                  {errors.address && <span className="text-[11px] text-destructive">{errors.address}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="apartment" className="text-xs font-semibold">
                      Apartment, Suite (optional)
                    </Label>
                    <Input
                      id="apartment"
                      placeholder="Apt 4B"
                      value={formData.apartment}
                      onChange={(e) => handleInputChange('apartment', e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-semibold">
                      City *
                    </Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`text-xs h-9 ${errors.city ? 'border-destructive' : ''}`}
                    />
                    {errors.city && <span className="text-[11px] text-destructive">{errors.city}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="state" className="text-xs font-semibold">
                      State / Region *
                    </Label>
                    <Input
                      id="state"
                      placeholder="e.g. California"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`text-xs h-9 ${errors.state ? 'border-destructive' : ''}`}
                    />
                    {errors.state && <span className="text-[11px] text-destructive">{errors.state}</span>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="postalCode" className="text-xs font-semibold">
                      Postal Code *
                    </Label>
                    <Input
                      id="postalCode"
                      placeholder="94103"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={`text-xs h-9 ${errors.postalCode ? 'border-destructive' : ''}`}
                    />
                    {errors.postalCode && <span className="text-[11px] text-destructive">{errors.postalCode}</span>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="country" className="text-xs font-semibold">
                      Country
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      disabled
                      className="text-xs h-9 bg-muted/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Delivery Method */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-foreground">
                3. Delivery Options
              </h2>

              <RadioGroup
                value={deliveryMethod}
                onValueChange={(val: 'standard' | 'express') => setDeliveryMethod(val)}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <label
                  htmlFor="del-std"
                  className={`flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${deliveryMethod === 'standard'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:bg-muted/40'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-foreground">Standard Delivery</span>
                    <RadioGroupItem value="standard" id="del-std" />
                  </div>
                  <p className="text-xs text-muted-foreground">3–5 business days</p>
                  <span className="text-xs font-semibold text-foreground mt-2">
                    {subtotal >= 75 ? 'FREE (Orders $75+)' : '$9.99'}
                  </span>
                </label>

                <label
                  htmlFor="del-exp"
                  className={`flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${deliveryMethod === 'express'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:bg-muted/40'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-foreground">Express Priority</span>
                    <RadioGroupItem value="express" id="del-exp" />
                  </div>
                  <p className="text-xs text-muted-foreground">1–2 business days</p>
                  <span className="text-xs font-semibold text-foreground mt-2">$19.99</span>
                </label>
              </RadioGroup>
            </div>

            {/* 4. Payment Simulation */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground">
                  4. Payment Method
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <Lock className="size-3.5 text-emerald-500" />
                  <span>Encrypted</span>
                </div>
              </div>

              {/* Payment Methods Grid Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {/* 1. Credit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit-card')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center gap-2 cursor-pointer ${paymentMethod === 'credit-card'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                      : 'border-border hover:bg-muted/40 text-muted-foreground'
                    }`}
                >
                  <div className="flex items-center gap-1 h-5">
                    <VisaIcon className="h-3 w-auto" />
                    <MastercardIcon className="h-3 w-auto" />
                    <AmexIcon className="h-3 w-auto" />
                  </div>
                  <span className="text-xs font-semibold">Credit Card</span>
                </button>

                {/* 2. PayPal */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center gap-2 cursor-pointer ${paymentMethod === 'paypal'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                      : 'border-border hover:bg-muted/40 text-muted-foreground'
                    }`}
                >
                  <div className="flex items-center justify-center h-5">
                    <PaypalIcon className="h-4 w-auto" />
                  </div>
                  <span className="text-xs font-semibold">PayPal</span>
                </button>

                {/* 3. Apple Pay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple-pay')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center gap-2 cursor-pointer ${paymentMethod === 'apple-pay'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                      : 'border-border hover:bg-muted/40 text-muted-foreground'
                    }`}
                >
                  <div className="flex items-center justify-center h-5">
                    <ApplePayIcon className="h-4 w-auto" />
                  </div>
                  <span className="text-xs font-semibold">Apple Pay</span>
                </button>

                {/* 4. Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash-on-delivery')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center gap-2 cursor-pointer ${paymentMethod === 'cash-on-delivery'
                      ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                      : 'border-border hover:bg-muted/40 text-muted-foreground'
                    }`}
                >
                  <div className="flex items-center justify-center h-5">
                    <Banknote className="size-5 text-foreground" />
                  </div>
                  <span className="text-xs font-semibold">Cash on Delivery</span>
                </button>
              </div>

              {/* Dynamic Content Based on Payment Method */}
              {paymentMethod === 'credit-card' && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="cardholderName" className="text-xs font-semibold">
                      Cardholder Name *
                    </Label>
                    <Input
                      id="cardholderName"
                      placeholder="Name on card"
                      value={formData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      className={`text-xs h-9 ${errors.cardholderName ? 'border-destructive' : ''}`}
                    />
                    {errors.cardholderName && <span className="text-[11px] text-destructive">{errors.cardholderName}</span>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cardNumber" className="text-xs font-semibold">
                      Card Number *
                    </Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        className={`text-xs h-9 pl-9 ${errors.cardNumber ? 'border-destructive' : ''}`}
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    </div>
                    {errors.cardNumber && <span className="text-[11px] text-destructive">{errors.cardNumber}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="expiryDate" className="text-xs font-semibold">
                        Expiration Date *
                      </Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className={`text-xs h-9 ${errors.expiryDate ? 'border-destructive' : ''}`}
                      />
                      {errors.expiryDate && <span className="text-[11px] text-destructive">{errors.expiryDate}</span>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="cvv" className="text-xs font-semibold">
                        CVV *
                      </Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        className={`text-xs h-9 ${errors.cvv ? 'border-destructive' : ''}`}
                      />
                      {errors.cvv && <span className="text-[11px] text-destructive">{errors.cvv}</span>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="sameBilling"
                      checked={formData.billingSameAsShipping}
                      onCheckedChange={(checked) => handleInputChange('billingSameAsShipping', Boolean(checked))}
                    />
                    <Label htmlFor="sameBilling" className="text-xs font-normal cursor-pointer">
                      Billing address is the same as shipping address
                    </Label>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-card border border-border">
                      <PaypalIcon className="h-5 w-auto" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground block">PayPal Express Checkout</span>
                      <span className="text-muted-foreground">Linked to {formData.email || 'your account'}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    You will be connected to PayPal to review your order details. Your transaction is covered by PayPal Buyer Protection.
                  </p>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle className="size-3.5" />
                    <span>Instant authorization simulation active</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'apple-pay' && (
                <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-card border border-border">
                      <ApplePayIcon className="h-5 w-auto" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground block">Apple Pay Quick Checkout</span>
                      <span className="text-muted-foreground">Ready for Touch ID or Face ID</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Authorize instantly with Apple Cash or your preferred card stored in Apple Wallet. No need to enter card details manually.
                  </p>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle className="size-3.5" />
                    <span>Biometric tokenization simulated</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'cash-on-delivery' && (
                <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-card border border-border text-foreground">
                      <Banknote className="size-5" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground block">Cash on Delivery (COD)</span>
                      <span className="text-muted-foreground">Pay upon receiving your delivery</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Pay in cash directly to the courier when your package arrives at your doorstep. Please prepare the exact total amount of <strong className="text-foreground">{formatCurrency(total)}</strong>.
                  </p>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Truck className="size-3.5" />
                    <span>No advance payment required</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Order Summary (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Order Summary ({items.length} items)
              </h2>

              {/* Items Preview */}
              <div className="max-h-60 overflow-y-auto pr-1 divide-y divide-border/50">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3 first:pt-0 last:pb-0">
                    <div className="relative size-12 shrink-0 rounded-lg border border-border bg-muted/30 overflow-hidden">
                      <Image
                        src={item.product.thumbnail || item.product.images?.[0] || '/placeholder.png'}
                        alt={item.product.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-foreground line-clamp-1">
                        {item.product.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>Qty: {item.quantity}</span>
                        {item.selectedColor && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{item.selectedColor}</span>
                          </>
                        )}
                        {item.selectedSize && (
                          <>
                            <span>•</span>
                            <span>{item.selectedSize}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Line Items */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping ({deliveryMethod})</span>
                  <span className="font-semibold text-foreground">
                    {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Sales Tax (8%)</span>
                  <span className="font-semibold text-foreground">{formatCurrency(tax)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-base font-extrabold text-foreground pt-1">
                  <span>Total Due</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full h-12 text-sm font-bold gap-2 rounded-xl shadow-xs"
              >
                {isSubmitting ? (
                  'Authorizing & Placing Order...'
                ) : paymentMethod === 'paypal' ? (
                  <>
                    <PaypalIcon className="h-3.5 w-auto" />
                    Pay {formatCurrency(total)} with PayPal
                  </>
                ) : paymentMethod === 'apple-pay' ? (
                  <>
                    <ApplePayIcon className="h-3.5 w-auto" />
                    Pay with Apple Pay
                  </>
                ) : paymentMethod === 'cash-on-delivery' ? (
                  <>
                    <Truck className="size-4" />
                    Confirm Order ({formatCurrency(total)} COD)
                  </>
                ) : (
                  <>
                    <Lock className="size-4" />
                    Place Order • {formatCurrency(total)}
                  </>
                )}
                {!isSubmitting && paymentMethod === 'credit-card' && <ArrowRight className="size-4" />}
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground text-center">
                <ShieldCheck className="size-3.5 text-primary shrink-0" />
                <span>By placing this order you agree to the simulated store policies.</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
