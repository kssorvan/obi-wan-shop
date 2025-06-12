
"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/logo';

export function SplashScreen() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [progressValue, setProgressValue] = useState(0);
  const progressRef = useRef<HTMLProgressElement>(null);
  const statusZoneRef = useRef<HTMLDivElement>(null);

  const roundDecimals = (val: number, places: number) =>
    +(Math.round(parseFloat(val + "e+" + places)) + "e-" + places);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();
    const duration = 2500; // Splash screen visible for 2.5 seconds

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const currentVal = Math.min(elapsedTime / duration, 1);
      const roundedVal = roundDecimals(currentVal, 2);
      
      setProgressValue(roundedVal);

      if (progressRef.current) {
        progressRef.current.value = roundedVal;
        progressRef.current.setAttribute('aria-valuenow', `${Math.round(roundedVal * 100)}%`);
        // The innerText for <progress> is not standard for announcement, but we can set aria-valuetext
        progressRef.current.setAttribute('aria-valuetext', `${Math.round(roundedVal * 100)}% loaded`);
      }
      
      if (statusZoneRef.current) {
          statusZoneRef.current.setAttribute('aria-busy', (roundedVal < 1).toString());
      }

      if (currentVal < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setIsVisible(false);
        setTimeout(() => router.push('/auth/signin'), 500); // Navigate after fade out
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [router]);
  
  // Focus management for screen readers (optional, as role=progressbar should be announced)
  useEffect(() => {
    if (isVisible && progressRef.current) {
      // progressRef.current.focus(); // Focusing can be disruptive; use with caution.
                                  // Consider role="alert" on a status message if needed.
    }
  }, [isVisible, progressValue]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <Logo size="lg" className="mb-6" />
      <div 
        id="loading-zone" 
        role="status" 
        aria-live="polite" 
        ref={statusZoneRef}
        className="w-48 text-center"
      >
        <progress
          ref={progressRef}
          max="1"
          value={progressValue}
          className="w-full h-3 rounded-full appearance-none overflow-hidden"
          aria-label="Loading progress"
        >
          {`${Math.round(progressValue * 100)}%`}
        </progress>
        <p className="text-sm text-muted-foreground mt-2 sr-only">
            Loading: {Math.round(progressValue * 100)}%
        </p>
      </div>
    </div>
  );
}
