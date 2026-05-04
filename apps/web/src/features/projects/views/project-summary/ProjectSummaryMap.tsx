import Button from "@codegouvfr/react-dsfr/Button";
// oxlint-disable-next-line import/no-unassigned-import
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { routes } from "@/app/router";

// oxlint-disable-next-line import/no-unassigned-import
import "./ProjectSummaryMap.css";

type Props = {
  lat: number;
  long: number;
  addressLabel: string;
  siteName: string;
  siteId: string;
};
export function ProjectSummaryMap({ lat, long, addressLabel, siteName, siteId }: Props) {
  return (
    <MapContainer center={[lat, long]} zoom={25} className="z-0 h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, long]}>
        <Popup>
          <strong>{siteName}</strong>
          <br />
          {addressLabel}
        </Popup>
      </Marker>
      <div className="flex justify-center absolute bottom-4 left-0 w-full">
        <Button
          linkProps={routes.siteFeatures({ siteId }).link}
          iconId="fr-icon-map-pin-2-line"
          priority="secondary"
          className="bg-white dark:bg-black z-30"
        >
          Voir toutes les données du site
        </Button>
      </div>
    </MapContainer>
  );
}
