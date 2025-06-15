
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const steps = [
  { id: 'shipping', name: 'Shipping', href: '/checkout/shipping' },
  { id: 'review', name: 'Review', href: '/checkout/review' },
  { id: 'payment', name: 'Payment', href: '/checkout/payment' },
];

export function CheckoutSteps() {
  const pathname = usePathname();

  const getCurrentStepIndex = () => {
    const currentPathSegment = pathname.split('/').pop();
    return steps.findIndex(step => step.id === currentPathSegment);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol role="list" className="flex items-center justify-center space-x-2 sm:space-x-4">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="flex-1">
            {currentStepIndex > stepIdx ? (
              <Link href={step.href} className="group flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors hover:border-primary/80 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-primary transition-colors ">
                  {step.name}
                </span>
              </Link>
            ) : currentStepIndex === stepIdx ? (
              <div
                className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-primary">{step.name}</span>
              </div>
            ) : (
              <div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-muted-foreground transition-colors">
                  {step.name}
                </span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
