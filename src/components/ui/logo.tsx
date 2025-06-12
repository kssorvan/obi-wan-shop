
import type { SVGProps } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Shop icon from Flaticon (ID: 869441)
const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 490.4 490.4" // Original viewBox
    fill="currentColor" // Inherit color
    {...props}
  >
    <g>
      <path d="M479.6,143.6c-2.8-4-7.2-6.4-12-6.4H23.2c-4.8,0-9.2,2.4-12,6.4c-2.8,4-3.6,9.2-2,13.6l34.4,84.4c2.4,6,8,10,14.8,10h4.8 c6,0,11.2-3.2,14-8.4l31.2-58.4h300.4l31.2,58.4c2.8,5.2,8,8.4,14,8.4h4.8c6.8,0,12.4-4,14.8-10l34.4-84.4 C483.2,152.8,482.4,147.6,479.6,143.6z M103.6,190.8H60.4L40.8,148h44.8L103.6,190.8z M404.8,190.8l18-42.8h44.8l-20.4,42.8 H404.8z"/>
      <path d="M445.2,254H45.2c-13.2,0-23.2,10.8-22,24.4l14.4,133.6c1.2,12.8,12,22.4,24.8,22.4h342.8c12.8,0,23.6-9.6,24.8-22.4 l14.4-133.6C468.4,264.8,458.4,254,445.2,254z M245.2,406c-28.8,0-52.4-23.6-52.4-52.4c0-28.8,23.6-52.4,52.4-52.4 c28.8,0,52.4,23.6,52.4,52.4S274,406,245.2,406z"/>
    </g>
  </svg>
);

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconOnly?: boolean;
  ariaLabel?: string; // For explicit ARIA label when iconOnly
}

export function Logo({ size = 'md', className, iconOnly = false, ariaLabel }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  const defaultAriaLabel = "Obi-Wan-Shop Homepage";

  return (
    <Link 
      href="/home" 
      className={cn(
        'flex items-center gap-2 text-primary hover:text-primary/90 transition-colors group',
        className
      )}
      aria-label={iconOnly ? (ariaLabel || defaultAriaLabel) : undefined}
    >
      <LogoIcon className={cn(
        sizeClasses[size],
        'transition-transform duration-300 ease-in-out group-hover:scale-110'
      )} />
      {!iconOnly && (
        <span className={cn(
          'font-headline font-semibold',
          textSizeClasses[size]
        )}>
          Obi-Wan-Shop
        </span>
      )}
    </Link>
  );
}
