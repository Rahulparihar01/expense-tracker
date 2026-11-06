import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Lock, Loader2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
type ResetState = { email: string; otp: string };

function isResetState(value: unknown): value is ResetState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<ResetState>;
  return typeof state.email === 'string' && state.email.length > 0
    && typeof state.otp === 'string' && /^\d{6}$/.test(state.otp);
}

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const resetState = isResetState(location.state) ? location.state : null;

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    document.title = 'Set new password — ExpenseTrack';
    if (!resetState) {
      toast({
        title: 'Verify your code first',
        description: 'Request a new reset code and verify it before setting a password.',
        variant: 'destructive',
      });
      navigate('/login', { replace: true });
    }
  }, [navigate, resetState, toast]);

  const onSubmit = async ({ password }: ResetPasswordForm) => {
    if (!resetState) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp-reset-password', {
        body: {
          email: resetState.email,
          otp: resetState.otp,
          newPassword: password,
          action: 'reset',
        },
      });

      if (error || data?.error) {
        toast({
          title: 'Could not update password',
          description: error?.message || data?.error || 'Please verify your reset code again.',
          variant: 'destructive',
        });
        if (data?.error?.toLowerCase().includes('otp') || data?.error?.toLowerCase().includes('code')) {
          navigate('/login', { replace: true });
        }
        return;
      }

      toast({
        title: 'Password updated',
        description: 'You can now sign in with your new password.',
      });
      navigate('/login', { replace: true, state: { passwordWasReset: true } });
    } finally {
      setIsLoading(false);
    }
  };

  if (!resetState) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md">
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wallet className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Set new password</h1>
          <p className="mt-2 text-muted-foreground">Choose a new password for your account.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="password" autoComplete="new-password" placeholder="••••••••" className="h-11 pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="password" autoComplete="new-password" placeholder="••••••••" className="h-11 pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="h-11 w-full" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating password...</> : 'Update password'}
            </Button>
          </form>
        </Form>
      </section>
    </main>
  );
}