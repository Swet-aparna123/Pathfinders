'use client';

import dynamic from 'next/dynamic';

const StudentDashboard = dynamic(() => import('./StudentDashboard'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0A0F1D] flex items-center justify-center font-body text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 rounded-full border-2 border-[#D4A034] border-t-transparent animate-spin" />
        <span className="font-mono text-xs text-[#D4A034] tracking-wider uppercase font-semibold">
          Loading Student Dashboard...
        </span>
      </div>
    </div>
  ),
});

export default function StudentDashboardClientOnly() {
  return <StudentDashboard />;
}

