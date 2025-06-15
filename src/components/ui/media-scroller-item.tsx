
"use client";

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface MediaScrollerItemProps {
  href?: string;
  imageUrl: string;
  altText: string;
  title?: string;
  subtitle?: string;
  dataAiHint?: string;
  className?: string;
  imageClassName?: string;
  aspectRatio?: string; // e.g., 'aspect-square', 'aspect-video', 'aspect-[4/3]'
}

export function MediaScrollerItem({
  href,
  imageUrl,
  altText,
  title,
  subtitle,
  dataAiHint,
  className,
  imageClassName,
  aspectRatio = 'aspect-[3/4]', // Default to a portrait-like aspect ratio
}: MediaScrollerItemProps) {
  const content = (
    <Card className={cn("overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full w-48 sm:w-56 md:w-64 flex-shrink-0", className)}>
      <div className={cn("relative w-full overflow-hidden", aspectRatio)}>
        <Image
          src={imageUrl}
          alt={altText}
          layout="fill"
          objectFit="cover"
          className={cn("group-hover:scale-105 transition-transform duration-300", imageClassName)}
          data-ai-hint={dataAiHint || 'media item'}
        />
      </div>
      {(title || subtitle) && (
        <CardContent className="p-3">
          {title && <h3 className="text-base font-semibold truncate text-primary group-hover:text-primary/90">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground group-hover:text-accent font-medium">{subtitle}</p>}
        </CardContent>
      )}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    );
  }

  return <div className="group">{content}</div>;
}
