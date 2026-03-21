import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          variant === 'default' && 'bg-gradient-to-b from-[#6366F1] to-[#4F46E5] text-white shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_rgba(255,255,255,0.2)] hover:from-[#7173F3] hover:to-[#5B54E8] border-none',
          variant === 'destructive' && 'bg-gradient-to-b from-red-600 to-red-700 text-white shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_rgba(255,255,255,0.2)] hover:from-red-500 hover:to-red-600 border-none',
          variant === 'outline' && 'border border-white/10 bg-[#0F0F1A]/80 shadow-[0_1px_2px_rgba(0,0,0,0.2)] hover:bg-[#1E293B] hover:border-white/20 text-[#F1F5F9]',
          variant === 'secondary' && 'bg-[#1E293B] text-[#F1F5F9] shadow-sm hover:bg-[#334155]',
          variant === 'ghost' && 'hover:bg-white/5 text-[#94A3B8] hover:text-[#F1F5F9]',
          variant === 'link' && 'text-[#6366F1] underline-offset-4 hover:underline',
          size === 'default' && 'h-9 px-4 py-2',
          size === 'sm' && 'h-8 rounded-md px-3 text-xs',
          size === 'lg' && 'h-10 rounded-md px-8',
          size === 'icon' && 'h-9 w-9',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-white/10 bg-[#0F0F1A]/50 px-3 py-2 text-sm shadow-[0_2px_4px_rgba(0,0,0,0.1)_inset] transition-all placeholder:text-[#64748B] hover:border-white/20 focus-visible:border-[#6366F1]/50 focus-visible:bg-[#0F0F1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/30 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border border-white/10 bg-[#0F0F1A] text-[#F1F5F9] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden', className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-semibold leading-none tracking-tight text-xl', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-[#94A3B8]', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}
