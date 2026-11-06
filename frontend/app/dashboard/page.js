import StudentDashboardClientOnly from '@/components/StudentDashboardClientOnly';
import GrainOverlay from '@/components/GrainOverlay';

export const metadata = {
  title: 'Student Dashboard — PathFinders',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudentDashboardPage() {
  return (
    <div className="relative min-h-screen bg-[#f3ead3] text-[#1C2536] font-body">
      <GrainOverlay />
      <StudentDashboardClientOnly />
    </div>
  );
}
