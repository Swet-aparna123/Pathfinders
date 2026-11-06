'use client';

import CareerSwitcherDashboardComponent from '@/components/CareerSwitcherDashboard';
import GrainOverlay from '@/components/GrainOverlay';

export default function CareerSwitcherDashboardPage() {
  return (
    <div className="relative min-h-screen bg-[#f3ead3] text-[#1C2536] font-body">
      <GrainOverlay />
      <CareerSwitcherDashboardComponent />
    </div>
  );
}
