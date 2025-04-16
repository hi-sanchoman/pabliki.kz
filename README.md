# Linklot - Next.js with Drizzle ORM and Supabase

A modern, professional Next.js application using Drizzle ORM with Supabase for a powerful and type-safe database experience.

## Key Technologies

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **Supabase** as the PostgreSQL provider
- **TanStack Query** for client-side data fetching
- **Zod** for schema validation
- **Shadcn UI** for component library
- **Tailwind CSS** for styling

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project (or a PostgreSQL database)

### Environment Setup

1. Copy the example environment file:

   ```
   cp .env.example .env.local
   ```

2. Update the environment variables in `.env.local` with your own values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   DATABASE_URL=your-database-connection-string
   ```

### Installation

Install dependencies:

```bash
npm install
```

### Database Setup

1. Generate migrations from your schema:

   ```bash
   npm run db:generate
   ```

2. Apply migrations to your database:
   ```bash
   npm run db:migrate
   ```

Alternatively, you can use `db:push` for development:

```bash
npm run db:push
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/               # App Router pages
├── components/        # UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
│   ├── db/            # Database configuration
│   │   ├── migrations/   # Database migrations
│   │   ├── repositories/ # Data access repositories
│   │   ├── db.ts      # Database client
│   │   └── schema.ts  # Database schema
│   └── validations/   # Zod validation schemas
├── services/          # External service integrations
├── store/             # State management with Zustand
└── types/             # TypeScript type definitions
```

## Database Usage

### Repository Pattern

We use the repository pattern for database access. Example:

```typescript
// Get all users
const users = await usersRepository.getAll();

// Get user by ID
const user = await usersRepository.getById('user-id');

// Create a user
const newUser = await usersRepository.create({
  name: 'Jane Doe',
  email: 'jane@example.com',
});
```

### Server Actions

Server actions provide type-safe API endpoints:

```typescript
// In a server component or route handler
import { createUser, getPosts } from '@/app/api/actions';

// Get all posts with pagination
const { posts, pagination } = await getPosts(1, 10);

// Create a new user (from a form)
const result = await createUser(formData);
```

## Authentication and Database Synchronization

The application uses Supabase Auth for authentication. When a user registers through Supabase Auth, a trigger should automatically create a corresponding record in the `public.users` table and the `public.profiles` table.

If you encounter an issue where authenticated users are not properly synced with the application database, you can run the auth sync migration:

```bash
npx tsx src/lib/db/migrations/fix-auth-sync.ts
```

This script will:

1. Check if users exist in auth.users but not in public.users, and create them
2. Check if users in public.users don't have profiles, and create them
3. Verify that the trigger exists for future registrations

## License

This project is licensed under the MIT License.
