'use client';

import { useQuery } from '@tanstack/react-query';
import { LinkCard, LinkCardProps } from './LinkCard';
import { AddLinkCard } from './AddLinkCard';

// Mock data for links
const mockLinks: LinkCardProps[] = [
  {
    id: '1',
    url: 'https://youtube.com',
    title: 'YouTube - Video sharing platform',
    description: 'Share your videos with friends, family, and the world',
    favicon: 'https://www.youtube.com/favicon.ico',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    tags: ['video', 'entertainment'],
    lotIds: ['entertainment'],
  },
  {
    id: '2',
    url: 'https://research.ai',
    title: 'Research.AI - The next generation of marketing powered by AI',
    description: 'Simple and intuitive tools to give your marketing team superpowers.',
    favicon: 'https://research.ai/favicon.ico',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    tags: ['ai', 'deeplearning', 'documentation'],
    lotIds: ['research'],
  },
  {
    id: '3',
    url: 'https://nextjs.org',
    title: 'Next.js by Vercel - The React Framework',
    description: 'Production grade React applications that scale.',
    favicon: 'https://nextjs.org/favicon.ico',
    thumbnail:
      'https://assets.vercel.com/image/upload/v1711040074/front/framework%20pages/Vercel_Next_OG.png',
    tags: ['framework', 'react', 'development'],
    lotIds: ['dev-tools'],
  },
  {
    id: '4',
    url: 'https://shadcn.com',
    title: 'shadcn/ui - UI Components',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS.',
    favicon: 'https://shadcn.com/favicon.ico',
    thumbnail: 'https://ui.shadcn.com/og.jpg',
    tags: ['ui', 'components', 'design'],
    lotIds: ['dev-tools'],
  },
  {
    id: '5',
    url: 'https://tailwindcss.com',
    title: 'Tailwind CSS - Rapidly build modern websites without ever leaving your HTML',
    description:
      'A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.',
    favicon: 'https://tailwindcss.com/favicon.ico',
    thumbnail: 'https://tailwindcss.com/opengraph-image.jpg?22502194f1a254bc',
    tags: ['css', 'design', 'development'],
    lotIds: ['dev-tools'],
  },
];

export function LinkGrid() {
  // In a real app, you would fetch links from your API
  const { data: links = [], isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockLinks;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-6 pb-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-lg bg-slate-300 dark:bg-slate-600 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 px-6 pb-6">
      <AddLinkCard />

      {links.map((link) => (
        <LinkCard key={link.id} {...link} />
      ))}
    </div>
  );
}
