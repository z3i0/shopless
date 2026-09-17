import React from "react";
import Image from "next/image";

interface PaymentBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VisaIcon({ className = "h-full w-auto object-contain" }: { className?: string }) {
  return (
    <Image
      src="/images/payments/visa.svg"
      alt="Visa"
      width={48}
      height={30}
      className={className}
    />
  );
}

export function MastercardIcon({ className = "h-full w-auto object-contain" }: { className?: string }) {
  return (
    <Image
      src="/images/payments/mastercard.svg"
      alt="Mastercard"
      width={48}
      height={30}
      className={className}
    />
  );
}

export function AmexIcon({ className = "h-full w-auto object-contain" }: { className?: string }) {
  return (
    <Image
      src="/images/payments/amex.svg"
      alt="American Express"
      width={48}
      height={30}
      className={className}
    />
  );
}

export function PaypalIcon({ className = "h-full w-auto object-contain" }: { className?: string }) {
  return (
    <Image
      src="/images/payments/paypal.svg"
      alt="PayPal"
      width={48}
      height={30}
      className={className}
    />
  );
}

export function ApplePayIcon({ className = "h-full w-auto object-contain" }: { className?: string }) {
  return (
    <Image
      src="/images/payments/apple-pay.svg"
      alt="Apple Pay"
      width={48}
      height={30}
      className={className}
    />
  );
}

export function PaymentBadges({ className = "" }: PaymentBadgeProps) {
  const cardClasses =
    "relative flex items-center justify-center h-7 w-11 sm:h-7.5 sm:w-12 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white shadow-2xs hover:shadow-xs hover:border-neutral-400 dark:hover:border-neutral-500 transition-all p-1 overflow-hidden";

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label="Accepted payment methods"
    >
      <div className={cardClasses} title="Visa">
        <VisaIcon />
      </div>
      <div className={cardClasses} title="Mastercard">
        <MastercardIcon />
      </div>
      <div className={cardClasses} title="American Express">
        <AmexIcon />
      </div>
      <div className={cardClasses} title="PayPal">
        <PaypalIcon />
      </div>
      <div className={cardClasses} title="Apple Pay">
        <ApplePayIcon />
      </div>
    </div>
  );
}
