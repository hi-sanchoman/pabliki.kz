'use server';

import { z } from 'zod';
import { usersRepository } from '@/lib/db/repositories/users';

// Example of a server action to create a user
export async function createUser(formData: FormData) {
  const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  });

  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: parsed.error.format() };
  }

  try {
    const { name, email, password } = parsed.data;

    // Check if user already exists
    const existingUser = await usersRepository.getByEmail(email);
    if (existingUser) {
      return { error: { email: ['Email already in use'] } };
    }

    // In a real app, you'd hash the password before storing
    const user = await usersRepository.create({
      name,
      email,
      password, // In production: await bcrypt.hash(password, 10)
    });

    return { success: true, user };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: { _form: ['Failed to create user'] } };
  }
}
