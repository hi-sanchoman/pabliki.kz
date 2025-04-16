import NextAuth from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Create schema for credentials validation
const credentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Define user type with id
interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// Extend session type
interface ExtendedSession {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
}

// Initialize Supabase client for auth
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const handler = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.NEXTAUTH_SECRET!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate credentials format
        const result = credentialsSchema.safeParse(credentials);
        if (!result.success) {
          return null;
        }

        const { email, password } = result.data;

        // Authenticate with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user) {
          console.error('Authentication error:', error);
          return null;
        }

        // Return the authenticated user
        return {
          id: data.user.id,
          name: data.user.user_metadata?.name || email.split('@')[0],
          email: data.user.email,
          image: data.user.user_metadata?.avatar_url,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as User).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        ((session as ExtendedSession).user as User).id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle relative URLs (internal redirects)
      if (url.startsWith('/')) {
        // If path is just root "/" add default locale
        if (url === '/') {
          return `${baseUrl}/en`;
        }

        // Special handling for auth routes without locale
        if (url.startsWith('/auth/')) {
          return `${baseUrl}/en${url}`;
        }

        // If already has locale prefix, don't add another one
        if (url.match(/^\/[a-z]{2}\//)) {
          return `${baseUrl}${url}`;
        }

        // For all other paths without locale, add default locale
        return `${baseUrl}/en${url}`;
      }
      // Handle absolute URLs (maintain external redirects)
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/en/auth/login',
    signOut: '/en/auth/login',
    error: '/en/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
