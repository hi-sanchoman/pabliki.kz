'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, FolderIcon, Plus, Tag } from 'lucide-react';
import { useTranslation } from '@/i18n/client';

// Mock data for lots - removing since it's not used anymore
// type Lot = {
//   id: string;
//   name: string;
//   color?: string;
// };

// const mockLots: Lot[] = [
//   { id: 'productivity', name: 'Productivity', color: '#10B981' }, // emerald
//   { id: 'research', name: 'Research', color: '#0EA5E9' }, // sky blue
//   { id: 'dev-tools', name: 'Dev Tools', color: '#F59E0B' }, // amber
// ];

// Mock data for tags
type Tag = {
  id: string;
  name: string;
};

const mockTags: Tag[] = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'design', name: 'Design' },
  { id: 'development', name: 'Development' },
];

export function AddLinkCard() {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsSubmitting(true);

    // Here you would call your API to save the link
    // For now, we're just simulating a delay
    setTimeout(() => {
      setUrl('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div
      id="add-link-card"
      className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full"
    >
      {/* Header with colored circles */}
      <div className="p-5 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
        <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
      </div>

      <div id="form-input" className="px-5 flex-1 flex flex-col justify-center">
        {/* Title and subtitle */}
        <h3 className="text-xl font-medium mb-2">
          {t('links.quickly_save') || 'Quickly Save a Link'}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          {t('links.paste_link_description') ||
            "Paste a link, and we'll instantly fetch its title, preview, and details for you—quick like magic!"}
        </p>

        {/* Input field with button */}
        <form onSubmit={handleAddLink} className="w-full mb-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="url"
                placeholder={t('links.enter_url') || 'Enter URL here'}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 pr-4 bg-slate-100 dark:bg-slate-800 border-0 focus-visible:ring-0 focus:border-0 h-10 text-slate-600"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || !url}
              className="bg-slate-400 hover:bg-slate-500 h-10 rounded-lg px-5 cursor-pointer"
            >
              {isSubmitting ? t('common.saving') || 'Saving' : t('links.add_link') || 'Add Link'}
            </Button>
          </div>
        </form>

        {/* Lots row */}
        <div className="mb-3">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
            <button className="flex shrink-0 items-center text-gray-500 cursor-pointer transition-colors rounded-md pr-2 py-2.5">
              <FolderIcon className="h-4 w-4 mr-1.5 text-gray-300" fill="#d1d5dc" />
              <span className="font-medium text-xs">{t('lot.add_to_lot') || 'Add to Lot'}</span>
            </button>

            {/* Lot buttons removed as per user changes */}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-slate-200 dark:bg-slate-700 mb-3"></div>

        {/* Tags row */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
          <button className="flex shrink-0 items-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition-colors rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700">
            <Plus className="h-4 w-4 mr-1.5 text-slate-400" />
            <span className="font-medium text-xs">{t('tags.add_tag') || 'Add Tag'}</span>
          </button>

          {/* Tag buttons */}
          {mockTags.map((tag) => (
            <button
              key={tag.id}
              className="flex shrink-0 items-center bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer transition-colors rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700"
            >
              <Tag className="h-3 w-3 mr-1.5 text-slate-400" />
              <span className="font-medium text-xs">{tag.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
