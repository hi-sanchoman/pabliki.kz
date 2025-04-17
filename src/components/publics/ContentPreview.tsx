'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import {
  format,
  addDays,
  getDaysInMonth,
  startOfMonth,
  getDay,
  isToday,
  isBefore,
  isAfter,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentPreviewProps {
  contentType: 'reels' | 'stories' | 'link';
  description: string;
  file?: File | null;
  link?: string;
}

export function ContentPreview({ contentType, description, file, link }: ContentPreviewProps) {
  const [date, setDate] = useState<Date>(addDays(new Date(), 1));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateSelect = (day: Date) => {
    setDate(day);
    setCalendarOpen(false);
  };

  const handleSubmitToModeration = async () => {
    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Normally would submit form data here
    console.log('Submitted for moderation', { contentType, description, file, link, date });

    setSubmitting(false);
    // Would typically navigate or show success message
  };

  // Generate calendar days
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = startOfMonth(currentMonth);
    const firstDayWeekday = getDay(firstDayOfMonth); // 0 = Sunday, 1 = Monday, etc.

    const days = [];
    const today = new Date();

    // Days of week headers (Su, Mo, Tu, etc.)
    const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    // Month and year selector
    const monthName = format(currentMonth, 'LLLL yyyy', { locale: ru });

    // Navigation buttons
    const handlePrevMonth = () => {
      const prevMonth = new Date(currentMonth);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      setCurrentMonth(prevMonth);
    };

    const handleNextMonth = () => {
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setCurrentMonth(nextMonth);
    };

    // Header with month/year and navigation
    const header = (
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="font-medium">{monthName}</div>
        <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );

    // Days of week row
    const weekdaysRow = (
      <div className="grid grid-cols-7 mb-2">
        {daysOfWeek.map((day, index) => (
          <div key={`weekday-${index}`} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
    );

    // Create empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Create cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isSelected =
        date &&
        currentDate.getDate() === date.getDate() &&
        currentDate.getMonth() === date.getMonth() &&
        currentDate.getFullYear() === date.getFullYear();

      const isDisabled = isBefore(currentDate, today) && !isToday(currentDate);

      days.push(
        <button
          key={`day-${day}`}
          disabled={isDisabled}
          onClick={() => !isDisabled && handleDateSelect(currentDate)}
          className={`h-8 w-8 flex items-center justify-center rounded-full text-sm
            ${isSelected ? 'bg-blue-500 text-white' : ''}
            ${isToday(currentDate) && !isSelected ? 'bg-blue-100 text-blue-700 font-medium' : ''}
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
          `}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-4 bg-white rounded-lg shadow-lg">
        {header}
        {weekdaysRow}
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  return (
    <Card className="w-full bg-white shadow-sm border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-gray-800">
          ПРЕДВАРИТЕЛЬНЫЙ ПРОСМОТР КОНТЕНТА
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-lg mb-4">
              {contentType === 'reels' ? 'ПОСТ/REELS' : 'STORIES'}
            </h3>
            <div className="rounded-lg overflow-hidden shadow-md">
              {contentType === 'reels' ? (
                <div className="relative bg-white rounded-lg">
                  <div className="border-b pb-2 px-3 pt-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-200"></div>
                    <div className="text-sm font-semibold">pabliki.kz</div>
                    <div className="ml-auto">...</div>
                  </div>
                  <div className="aspect-square bg-blue-100 flex items-center justify-center relative">
                    {file ? (
                      file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-blue-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                          </svg>
                          <p className="mt-2 text-sm">Видео превью</p>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-7xl text-blue-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Реклама в сотнях популярных пабликах
                        </p>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-blue-500 text-white py-1 px-3 rounded-full text-sm">
                        Запустим за 24 часа
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <div className="flex gap-2 py-2">
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
                        className="text-red-500"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
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
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
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
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </div>
                    <p className="text-sm mt-1 break-words">
                      {description ||
                        'Реклама в сотнях популярных пабликах. Запустим вашу рекламу за 24 часа.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative bg-white border rounded-lg w-52 mx-auto">
                  <div className="h-96 bg-blue-100 flex items-center justify-center relative">
                    <div className="absolute top-2 left-0 right-0 flex justify-center">
                      <div className="text-sm font-medium bg-blue-500/20 rounded-full px-3 py-1 backdrop-blur-sm text-blue-800">
                        pabliki.kz
                      </div>
                    </div>
                    {file ? (
                      file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-blue-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                          </svg>
                          <p className="mt-2 text-sm">Видео превью</p>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center px-4 text-center">
                        <div className="text-5xl text-blue-300 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                        <p className="text-sm text-white font-medium bg-blue-500/80 p-3 rounded-lg">
                          РЕКЛАМА В СОТНЯХ ПОПУЛЯРНЫХ ПАБЛИКАХ
                        </p>
                        <div className="mt-4 text-blue-600 text-xs">Запустим за 24 часа</div>
                      </div>
                    )}
                    {contentType === 'link' && link && (
                      <div className="absolute bottom-4 left-0 right-0 px-4">
                        <div className="bg-white rounded-lg shadow-lg py-2 px-4 flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500"
                          >
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                          </svg>
                          <div className="text-xs truncate">Перейти на сайт</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2 flex items-center justify-between">
                    <div className="flex gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-10 h-1 bg-blue-500 rounded-full"></div>
                    </div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-4">Выбрать дату размещения</h3>
              <div className="relative">
                <div
                  className="flex items-center justify-between p-3 border rounded-lg bg-white cursor-pointer"
                  onClick={() => setCalendarOpen(!calendarOpen)}
                >
                  <span>{format(date, 'd MMMM yyyy', { locale: ru })}</span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </div>

                {calendarOpen && <div className="absolute z-50 mt-1">{renderCalendar()}</div>}
              </div>
            </div>

            <div className="mt-auto">
              <Button
                onClick={handleSubmitToModeration}
                disabled={!date || submitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 text-lg rounded-full"
              >
                {submitting ? 'Обработка...' : 'отправить на модерацию'}
              </Button>

              <div className="mt-4 text-sm text-gray-600">
                <p>После отправки на модерацию Ваша заявка будет рассмотрена в течении 24х часов</p>
                <p>
                  Ответ будет предоставлен к вам на почту, а также будет направленно пуш
                  уведомление.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
