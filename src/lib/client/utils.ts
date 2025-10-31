import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cl = (...args: ClassValue[]) => twMerge(clsx(...args));