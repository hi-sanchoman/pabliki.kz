'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TopicInputProps {
  topics: string[];
  onTopicsChange: (topics: string[]) => void;
}

export function TopicInput({ topics, onTopicsChange }: TopicInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();

      const newTopic = inputValue.trim();
      if (newTopic && !topics.includes(newTopic)) {
        onTopicsChange([...topics, newTopic]);
        setInputValue('');
      }
    }
  };

  const removeTopic = (topicToRemove: string) => {
    onTopicsChange(topics.filter((topic) => topic !== topicToRemove));
  };

  return (
    <div className="w-full space-y-2">
      <div className="text-sm font-medium mb-1">Тематика пабликов</div>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Тематика пабликов (введите и нажмите Enter)"
          className="bg-white"
        />
      </div>

      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {topics.map((topic, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 cursor-pointer hover:bg-gray-200"
              onClick={() => removeTopic(topic)}
            >
              <span>{topic}</span>
              <X
                className="h-3 w-3 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTopic(topic);
                }}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
