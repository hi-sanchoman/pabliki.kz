'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, LinkIcon, SendIcon } from 'lucide-react';
import { ContentPreview } from './ContentPreview';

type UploadOption = 'reels' | 'stories' | 'link';

export function ContentUploadSection() {
  const [selectedOption, setSelectedOption] = useState<UploadOption>('reels');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleOptionSelect = (option: UploadOption) => {
    setSelectedOption(option);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowPreview(true);
  };

  const resetForm = () => {
    setDescription('');
    setLink('');
    setFile(null);
    setIsSubmitted(false);
    setShowPreview(false);
  };

  if (isSubmitted) {
    return (
      <Card className="w-full bg-white shadow-sm border-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-center text-gray-800">Загрузка завершена</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-6 pb-8">
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="text-center text-gray-600 mb-6">
            Ваш контент успешно загружен и отправлен на модерацию. Мы уведомим вас, когда он будет
            опубликован.
          </p>
          <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
            Загрузить еще
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showPreview) {
    return (
      <>
        <ContentPreview
          contentType={selectedOption}
          description={description}
          file={file}
          link={link}
        />
      </>
    );
  }

  return (
    <Card className="w-full bg-white shadow-sm border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-gray-800">ЗАГРУЗИТЕ КОНТЕНТ</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                selectedOption === 'reels'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
              onClick={() => handleOptionSelect('reels')}
            >
              <div className="rounded-full bg-gray-900 p-3 mb-3">
                <Download className="h-6 w-6 text-white" />
              </div>
              <span className="font-medium text-lg">ПОСТ / Reels</span>
              <div className="absolute right-3 top-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedOption === 'reels' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}
                ></div>
              </div>
            </div>

            <div
              className={`relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                selectedOption === 'stories'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
              onClick={() => handleOptionSelect('stories')}
            >
              <div className="rounded-full bg-gray-900 p-3 mb-3">
                <Download className="h-6 w-6 text-white" />
              </div>
              <span className="font-medium text-lg">STORIES</span>
              <div className="absolute right-3 top-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedOption === 'stories' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}
                ></div>
              </div>
            </div>

            <div
              className={`relative flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer transition-all ${
                selectedOption === 'link'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
              onClick={() => handleOptionSelect('link')}
            >
              <div className="rounded-full bg-gray-900 p-3 mb-3">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <span className="font-medium text-lg">Прикрепить ссылку в Stories</span>
              <div className="absolute right-3 top-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedOption === 'link' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {selectedOption === 'link' ? (
            <div className="mt-6">
              <div className="relative">
                <Input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Ссылка"
                  className="bg-gray-100 border-gray-200 py-3 px-4 rounded-xl"
                />
                <div className="absolute right-0 top-0 bg-gray-200 h-full flex items-center px-4 rounded-r-xl text-gray-500">
                  <span className="text-sm">Вшитая по умолчанию наша UTM - метка</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                <Download className="h-8 w-8 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 mb-3">
                  Перетащите файл сюда или нажмите для выбора
                </p>
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept={selectedOption === 'reels' ? 'video/*,image/*' : 'image/*,video/*'}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-blue-500 text-blue-500"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Выбрать файл
                </Button>
                {file && <div className="mt-3 text-sm text-blue-600">Выбран файл: {file.name}</div>}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ОПИСАНИЕ ДЛЯ ВАШЕЙ ПУБЛИКАЦИИ</h3>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-50 border-gray-200 min-h-[120px] rounded-lg"
              placeholder="Введите описание для вашей публикации..."
            />
          </div>

          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить'}
              {!isSubmitting && <SendIcon className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
