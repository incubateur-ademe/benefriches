import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

type PropsType = {
  lat: number;
  long: number;
  popup?: string;
};

const MarkerLeafletMap = (props: PropsType) => {
  const { long, lat, popup } = props;
  const position = [lat, long] as LatLngExpression;

  return (
    <div className="fr-my-2w" style={{ height: "400px", width: "100%" }}>
      <MapContainer center={position} zoom={150} style={{ height: "inherit" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>{popup && <Popup>{popup}</Popup>}</Marker>
      </MapContainer>
    </div>
  );
};

export default MarkerLeafletMap;
