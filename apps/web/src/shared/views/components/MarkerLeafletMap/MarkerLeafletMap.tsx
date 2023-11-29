import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./leaflet-override.css";

type PropsType = {
  lat?: number;
  long?: number;
  popup?: string;
};

type MarkerLeafletMapSetViewPropsType = {
  position: LatLngExpression;
  zoom: number;
};

const FRANCE_CENTER_LAG_LONG_POSITION = [46.3223, 2.2549];

const SET_VIEW_OPTIONS = {
  animate: true,
  pan: {
    duration: 0.5,
  },
};

const MarkerLeafletMapSetView = ({
  position,
  zoom,
}: MarkerLeafletMapSetViewPropsType) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, zoom, SET_VIEW_OPTIONS);
  }, [map, position, zoom]);

  return null;
};

const MarkerLeafletMap = ({ lat, long, popup }: PropsType) => {
  const isValidPosition = lat && long;
  const zoom = isValidPosition ? 150 : 5;
  const displayMarker = isValidPosition;
  const position = useMemo(
    () =>
      (isValidPosition
        ? [lat, long]
        : FRANCE_CENTER_LAG_LONG_POSITION) as LatLngExpression,
    [isValidPosition, lat, long],
  );

  return (
    <div className="fr-my-2w" style={{ height: "400px", width: "100%" }}>
      <MapContainer center={position} zoom={zoom} style={{ height: "inherit" }}>
        <MarkerLeafletMapSetView position={position} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {displayMarker && (
          <Marker position={position}>{popup && <Popup>{popup}</Popup>}</Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MarkerLeafletMap;
