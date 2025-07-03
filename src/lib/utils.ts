import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address?: string, length = 6): string {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

export function formatDate(date: Date | string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(date).toLocaleDateString('en-US', options);
}
