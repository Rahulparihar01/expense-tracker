import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Lock, Loader2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { clearPasswordResetChallenge, readPasswordResetChallenge } from '@/lib/password-reset';
import { useToast } from '@/hooks/use-toast';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[0-9]/, 'Must contain a number')
  .regex(/[^a-zA-Z0-9]/, 'Must contain a special character');

const formSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [challengeAvailable, setChallengeAvailable] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'Set new password — ExpenseTrack';
    const challenge = readPasswordResetChallenge();
    if (!challenge) {
      navigate('/login', { replace: true });
      return;
    }
    setChallengeAvailable(true);
  }, [navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async ({ password }: FormValues) => {
    const challenge = readPasswordResetChallenge();
    if (!challenge) {
      toast({ title: 'Code verification expired', description: 'Request a new reset code to continue.', variant: 'destructive' });
      navigate('/login', { replace: true });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp-reset-password', {
        body: { email: challenge.email, otp: challenge.otp, newPassword: password, action: 'reset' },
      });

      if (error || data?.error) {
        toast({ title: 'Could not update password', description: error?.message || data?.error || 'Please request a new reset code.', variant: 'destructive' });
        if (data?.error?.includes('expired') || data?.error?.includes('Invalid or expired')) {
          clearPasswordResetChallenge();
          navigate('/login', { replace: true });
        }
        return;
      }

      clearPasswordResetChallenge();
      form.reset();
      toast({ title: 'Password updated', description: 'Sign in with your new password.' });
      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-12 flex-col justify-between">
        <Link to="/" className="relative flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center"><Wallet className="h-5 w-5" /></div>
          <span className="font-bold text-lg">ExpenseTrack</span>
        </Link>
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight mb-4">A fresh start for your account.</h2>
          <p className="text-primary-foreground/80 text-lg max-w-md">Choose a new password to keep your account secure.</p>
        </div>
        <p className="relative text-sm text-primary-foreground/70">© {new Date().getFullYear()} ExpenseTrack</p>
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-10">
        <div className="w-full max-w-md mx-auto">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Set new password</h1>
            <p className="text-muted-foreground mt-2">Enter your new password and confirm it below.</p>
          </div>
          {challengeAvailable && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><div className="relative"><Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input type="password" autoComplete="new-password" placeholder="••••••••" className="pl-10 h-11" {...field} /></div></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl><div className="relative"><Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input type="password" autoComplete="new-password" placeholder="••••••••" className="pl-10 h-11" {...field} /></div></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Update password'}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}