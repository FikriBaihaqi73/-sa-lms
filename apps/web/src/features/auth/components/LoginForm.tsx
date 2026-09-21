import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LoginSchema } from '@repo/shared/schemas/auth.schema';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type LoginFormValues = z.infer<typeof LoginSchema>;

export function LoginForm({ onRegisterClick }: { onRegisterClick?: () => void }) {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError('');
      await login(data);
      // NOTE: Handle redirect with TanStack Router after authentication
    } catch {
      setError('Invalid credentials or login failed');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200 dark:bg-red-950/50 dark:border-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register('email')}
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#forgot"
                  className="text-xs text-zinc-500 hover:text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                {...register('password')}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
            
            {onRegisterClick && (
              <div className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Don't have an account?{' '}
                <button 
                  type="button" 
                  onClick={onRegisterClick}
                  className="text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
                >
                  Sign up
                </button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
