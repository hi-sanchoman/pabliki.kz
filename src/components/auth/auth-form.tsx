'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Create schemas for login and register
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Define form types based on schemas
type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  type: 'login' | 'register';
  title: string;
  description: string;
  redirectPath: string;
  alternateLink: string;
  alternateLinkText: string;
  locale: string;
}

export function AuthForm({
  type,
  title,
  description,
  redirectPath,
  alternateLink,
  alternateLinkText,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale,
}: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Get the returnUrl from search params if available
  const returnUrl = searchParams.get('returnUrl') || redirectPath;

  // Choose the right schema based on form type
  const schema = type === 'login' ? loginSchema : registerSchema;

  // Initialize the form
  const form = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues:
      type === 'login'
        ? { email: '', password: '' }
        : { name: '', email: '', password: '', confirmPassword: '' },
  });

  // Handle form submission
  const onSubmit = async (values: LoginFormValues | RegisterFormValues) => {
    setIsLoading(true);

    try {
      if (type === 'login') {
        const response = await signIn('credentials', {
          email: (values as LoginFormValues).email,
          password: (values as LoginFormValues).password,
          callbackUrl: decodeURIComponent(returnUrl),
          redirect: false,
        });

        if (response?.error) {
          toast.error(
            response.error === 'CredentialsSignin' ? 'Invalid email or password' : response.error
          );
          setIsLoading(false);
          return;
        }

        toast.success('Logged in successfully');

        // Navigate to the success URL
        if (response?.url) {
          router.push(response.url);
        } else {
          router.push(decodeURIComponent(returnUrl));
        }
        router.refresh();
      } else {
        const registerValues = values as RegisterFormValues;

        // Make registration API call
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: registerValues.name,
            email: registerValues.email,
            password: registerValues.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.message || 'Failed to create account');
          setIsLoading(false);
          return;
        }

        toast.success('Account created successfully! Please login now.');

        // Redirect to login page after successful registration
        router.push(alternateLink);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card dark:bg-zinc-950 border-0 dark:border dark:border-zinc-800">
      <div className="flex justify-center mt-0">
        <div className="bg-white dark:bg-zinc-900 p-0 rounded-full"></div>
      </div>
      <CardHeader>
        <CardTitle className="text-center text-foreground dark:text-white">{title}</CardTitle>
        <CardDescription className="text-center text-muted-foreground dark:text-zinc-400">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {type === 'register' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-zinc-300">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-zinc-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-zinc-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === 'register' && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-zinc-300">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        className="dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : type === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card dark:bg-zinc-950 px-2 text-muted-foreground dark:text-zinc-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
              onClick={() => signIn('google', { callbackUrl: decodeURIComponent(returnUrl) })}
              disabled={isLoading}
            >
              Google
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground dark:text-zinc-400">
          {type === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <Link
            href={alternateLink}
            className="text-primary hover:text-primary/90 underline-offset-4 hover:underline"
          >
            {alternateLinkText}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
