import Waypoints from './Waypoints';
import Features from './Features';
import Portals from './Portals';
import Postcard from './Postcard';

export default function ExpeditionBody() {
  return (
    <div className="relative bg-parchment">
      <Waypoints />
      <Features />
      <Portals />
      <Postcard />
    </div>
  );
}
