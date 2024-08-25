import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const startCoords = [22.1696, 91.4996];
  const endCoords = [22.2637, 91.7159];
  const speed = 2000; // km/h
  const refreshRate = 50; // 20 FPS (1000ms / 50)
  const [position, setPosition] = useState(startCoords);
  const markerRef = useRef(null);

  useEffect(() => {
    const distance = calculateDistance(startCoords, endCoords); // km
    const duration = (distance / speed) * 3600; // seconds

    let startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = (Date.now() - startTime) / 1000; // seconds
      if (elapsedTime > duration) {
        setPosition(endCoords);
        clearInterval(interval);
        return;
      }
      const newPosition = calculateIntermediatePosition(startCoords, endCoords, elapsedTime / duration);
      setPosition(newPosition);
    }, refreshRate);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const distance = calculateDistance(startCoords, endCoords); // km
    const duration = (distance / speed) * 3600; // seconds
    let startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = (Date.now() - startTime) / 1000; // seconds
      if (elapsedTime > duration) {
        setPosition(endCoords);
        clearInterval(interval);
        return;
      }
      const newPosition = calculateIntermediatePosition(startCoords, endCoords, elapsedTime / duration);
      setPosition(newPosition);
    }, 100); // Adjust the interval to your desired update rate

    return () => clearInterval(interval); // Clean up on unmount
}, [startCoords, endCoords, speed]); // Add dependencies

  const calculateDistance = (start, end) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = degToRad(end[0] - start[0]);
    const dLng = degToRad(end[1] - start[1]);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(start[0])) * Math.cos(degToRad(end[0])) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const degToRad = (deg) => deg * (Math.PI / 180);

  const calculateIntermediatePosition = (start, end, fraction) => {
    return [
      start[0] + (end[0] - start[0]) * fraction,
      start[1] + (end[1] - start[1]) * fraction
    ];
  };

  const markerIcon1 = new L.Icon({
    iconUrl: require('./assets/Frame 334.png'), // Add your vessel icon here
    iconSize: [35, 135,45],
  });
  const markerIcon2 = new L.Icon({
    iconUrl: require('./assets/location_svgrepo.com (2).png'), // Add your vessel icon here
    iconSize: [35, 35],
  });
  const markerIcon = new L.Icon({
    iconUrl: require('./assets/location_svgrepo.com (1).png'), // Add your vessel icon here
    iconSize: [35, 35],
  });

  return (
    <MapContainer center={startCoords} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <Marker position={startCoords} icon={markerIcon2} /> {/* Start Marker */}
      <Marker position={endCoords} icon={markerIcon} /> {/* End Marker */}
      <Marker
        position={position}
        icon={markerIcon1}
        ref={markerRef}
      />
      <Polyline positions={[startCoords, position]} color="blue" />
    </MapContainer>
  );
};

export default App;
