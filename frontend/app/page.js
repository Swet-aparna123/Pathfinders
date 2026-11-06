import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TornDivider from '@/components/TornDivider';
import FieldNotes from '@/components/FieldNotes';
import ExpeditionBody from '@/components/ExpeditionBody';
import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';

export default function Home() {
  return (
    <main>
      <GrainOverlay />
      <Navbar />
      <Hero />
      <TornDivider />
      <FieldNotes />
      <ExpeditionBody />
      <Footer />
    </main>
  );
}
