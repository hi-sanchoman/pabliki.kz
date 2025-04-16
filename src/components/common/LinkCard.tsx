'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MoreVertical, ExternalLink, Link as LinkIcon, FolderIcon, Tag } from 'lucide-react';
import { useTranslation } from '@/i18n/client';

export type LinkCardProps = {
  id: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  thumbnail?: string;
  tags?: string[];
  lotIds?: string[];
};

// Mock data for lots
const mockLots = [
  { id: 'dev-tools', name: 'Dev Tools', color: '#F8BD49' }, // amber
  { id: 'productivity', name: 'Productivity', color: '#35BA83' }, // green
  { id: 'research', name: 'Research', color: '#60C9E8' }, // blue
];

export function LinkCard({
  url,
  title,
  description,
  favicon,
  thumbnail,
  tags = [],
}: LinkCardProps) {
  const { t } = useTranslation();
  const [thumbnailError, setThumbnailError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const hostname = new URL(url).hostname.replace('www.', '');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Header with address bar and controls */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-slate-200 dark:border-slate-800">
        <button className="p-1.5">
          <MoreVertical className="h-5 w-5 text-slate-400" />
        </button>

        <div className="flex-1 mx-2">
          <div className="bg-slate-100 dark:bg-slate-800 rounded-md py-1.5 px-3 text-center text-slate-500 dark:text-slate-400 text-sm">
            {hostname}
          </div>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5"
          aria-label={t('links.open_in_new_tab') || 'Open in new tab'}
        >
          <ExternalLink className="h-5 w-5 text-slate-400" />
        </a>
      </div>

      {/* Thumbnail */}
      <div className="p-2 pb-0">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {thumbnail && !thumbnailError ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              onError={() => setThumbnailError(true)}
              unoptimized // Use this to bypass Next.js image optimization for external images
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
              {favicon && !faviconError ? (
                <Image
                  src={favicon}
                  alt={hostname}
                  width={48}
                  height={48}
                  className="opacity-50"
                  onError={() => setFaviconError(true)}
                  unoptimized
                />
              ) : (
                <div className="text-6xl opacity-10">🔗</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Title and Content */}
      <div className="px-4 pt-2">
        {/* Title with icon */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-shrink-0">
            {favicon && !faviconError ? (
              <div className="w-6 h-6 flex items-center justify-center">
                <Image
                  src={favicon}
                  alt={hostname}
                  width={16}
                  height={16}
                  className="max-w-full"
                  onError={() => setFaviconError(true)}
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-6 h-6 flex items-center justify-center">
                <LinkIcon className="h-4 w-4 text-slate-400" />
              </div>
            )}
          </div>
          <h3 className="font-semibold text-base">
            {hostname === 'youtube.com' ? 'YouTube' : title}
          </h3>
        </div>

        {/* Description */}
        {description && (
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* Lots row */}
        <div className="mb-2">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
            {mockLots.map((lot) => (
              <button
                key={lot.id}
                className="flex shrink-0 items-center rounded-md px-2 py-1 cursor-pointer text-slate-600"
              >
                <FolderIcon
                  className="h-4 w-4 mr-1.5"
                  fill={lot.color}
                  stroke={lot.color}
                  strokeWidth={1.5}
                />
                <span className="font-medium text-xs">{lot.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-200 dark:bg-slate-700 mb-2"></div>

        {/* Tags row */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap py-1 pb-4">
          {tags && tags.length > 0 ? (
            tags.map((tag) => (
              <button
                key={tag}
                className="flex shrink-0 items-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition-colors rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700"
              >
                <Tag className="h-3 w-3 mr-1.5 text-slate-400" />
                <span className="font-medium text-xs">#{tag}</span>
              </button>
            ))
          ) : (
            <>
              <button className="flex shrink-0 items-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition-colors rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700">
                <Tag className="h-3 w-3 mr-1.5 text-slate-400" />
                <span className="font-medium text-xs">#ai</span>
              </button>
              <button className="flex shrink-0 items-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition-colors rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700">
                <Tag className="h-3 w-3 mr-1.5 text-slate-400" />
                <span className="font-medium text-xs">#deeplearning</span>
              </button>
              <button className="flex shrink-0 items-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition-colors rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700">
                <Tag className="h-3 w-3 mr-1.5 text-slate-400" />
                <span className="font-medium text-xs">#documentation</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
