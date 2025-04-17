'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RegionSelect, Region } from './filterForm/RegionSelect';
import { CitySelect, City } from './filterForm/CitySelect';
import { TopicInput } from './filterForm/TopicInput';
import { SubscriberCategoryToggle, SubscriberRange } from './filterForm/SubscriberCategoryToggle';
import { CostInput } from './filterForm/CostInput';
import { PublicSelectorButton, Public, publics } from './filterForm/PublicSelectorButton';
import { ActivitySelect, Activity } from './filterForm/ActivitySelect';
import { PublicResultsTable } from '@/components/publics/PublicResultsTable';
import Link from 'next/link';

export function PublicSelectorTabs() {
  // State for the first tab - "Подборка пабликов"
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [subscriberRanges, setSubscriberRanges] = useState<SubscriberRange[]>(['small']);
  const [cost, setCost] = useState<number>(580000);
  const [selectedPublics, setSelectedPublics] = useState<Public[]>([]);

  // State for the second tab - "Подборка по виду деятельности"
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [selectedActivityCities, setSelectedActivityCities] = useState<City[]>([]);
  const [activityPublics, setActivityPublics] = useState<Public[]>([]);
  const [activityCost, setActivityCost] = useState<number>(580000);

  // Results visible state
  const [showResults, setShowResults] = useState<boolean>(false);
  const [filteredPublics, setFilteredPublics] = useState<Public[]>([]);
  const [resultPublics, setResultPublics] = useState<Public[]>([]);

  const handleSearchByRegion = () => {
    // Filter publics based on the criteria (in a real app, this would be an API call)
    // For now, just show all publics for demonstration
    setFilteredPublics(publics);
    setResultPublics([]);
    setShowResults(true);
  };

  const handleSearchByActivity = () => {
    // Filter publics based on activity
    setFilteredPublics(publics);
    setResultPublics([]);
    setShowResults(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="by-region" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="by-region">ПОДБОРКА ПАБЛИКОВ</TabsTrigger>
          <TabsTrigger value="by-activity">ПОДБОРКА ПО ВИДУ ДЕЯТЕЛЬНОСТИ</TabsTrigger>
        </TabsList>

        <TabsContent value="by-region">
          <Card className="bg-blue-100 border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <RegionSelect
                  selectedRegions={selectedRegions}
                  onSelectRegion={setSelectedRegions}
                />
                <CitySelect
                  selectedRegions={selectedRegions}
                  selectedCities={selectedCities}
                  onSelectCity={setSelectedCities}
                />
                <TopicInput topics={topics} onTopicsChange={setTopics} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-center">
                <PublicSelectorButton
                  selectedPublics={selectedPublics}
                  onSelectPublics={setSelectedPublics}
                />
                <div className="flex flex-col">
                  <SubscriberCategoryToggle
                    value={subscriberRanges}
                    onChange={setSubscriberRanges}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm mb-1">Стоимость размещения</span>
                  <CostInput value={cost} onChange={setCost} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleSearchByRegion}>
                  Подобрать
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-activity">
          <Card className="bg-blue-100 border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <CitySelect
                  selectedRegions={[]} // Allow selecting from all cities
                  selectedCities={selectedActivityCities}
                  onSelectCity={setSelectedActivityCities}
                />
                <ActivitySelect
                  selectedActivities={selectedActivities}
                  onSelectActivity={setSelectedActivities}
                />
                <PublicSelectorButton
                  selectedPublics={activityPublics}
                  onSelectPublics={setActivityPublics}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <span className="text-sm mb-1">Стоимость размещения</span>
                  <CostInput value={activityCost} onChange={setActivityCost} />
                </div>
                <div className="md:col-span-2"></div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleSearchByActivity}>
                  Подобрать
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showResults && (
        <div className="mt-8">
          <PublicResultsTable
            publics={filteredPublics}
            selectedPublics={resultPublics}
            onSelectPublics={setResultPublics}
          />

          {resultPublics.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Link href="/register">
                <Button className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg">
                  Отправить заявку
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
