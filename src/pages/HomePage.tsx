import React from 'react';
import { Hero } from '../components/Hero';
import { ScrollVideo } from '../components/ScrollVideo';
import { ExperienceSection } from '../components/ExperienceSection';
import { FleetBridge } from '../components/FleetBridge';
import { ShowroomSection } from '../components/ShowroomSection';
import type { Car } from '../types/car';

export const HomePage: React.FC<{ cars: Car[] }> = ({ cars }) => (
  <>
    <Hero cars={cars} />
    <ScrollVideo cars={cars} />
    <ExperienceSection />
    <FleetBridge carCount={cars.length} />
    <ShowroomSection />
  </>
);
