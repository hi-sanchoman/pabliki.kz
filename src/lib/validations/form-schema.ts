import { z } from 'zod';

// Example login form schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100, { message: 'Password must not exceed 100 characters' }),
  rememberMe: z.boolean().default(false).optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Example signup form schema
export const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Must be a valid email' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(100, { message: 'Password must not exceed 100 characters' }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((value) => value === true, {
      message: 'You must accept terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
