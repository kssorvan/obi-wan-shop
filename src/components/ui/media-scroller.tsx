
"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showNavigationButtons?: boolean;
}

export function MediaScroller({ className, children, showNavigationButtons = true, ...props }: MediaScrollerProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollerRef.current) {
      const scrollAmount = scrollerRef.current.clientWidth * 0.8; // Scroll 80% of visible width
      scrollerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={cn("relative group", className)} {...props}>
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto py-4 space-x-4 no-scrollbar scroll-smooth"
      >
        {children}
      </div>
      {showNavigationButtons && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none; 
          scrollbar-width: none; 
        }
      `}</style>
    </div>
  );
}
