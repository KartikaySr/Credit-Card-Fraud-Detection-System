'use client';
import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function GeoHeatmap() {
  const [markers, setMarkers] = useState([
    { markerOffset: -15, name: "New York (High Risk)", coordinates: [-74.006, 40.7128], isFraud: true },
    { markerOffset: -15, name: "London", coordinates: [-0.1278, 51.5074], isFraud: false },
    { markerOffset: 25, name: "Singapore (Anomaly)", coordinates: [103.8198, 1.3521], isFraud: true },
    { markerOffset: 25, name: "Tokyo", coordinates: [139.6917, 35.6895], isFraud: false },
    { markerOffset: 15, name: "Lagos (Spike)", coordinates: [3.3792, 6.5244], isFraud: true },
    { markerOffset: -15, name: "Sao Paulo", coordinates: [-46.6333, -23.5505], isFraud: false },
  ]);

  // Simulate real-time fraud blips
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkers(prev => {
        const newMarkers = [...prev];
        // Randomly toggle fraud status on a marker to simulate live activity
        const randomIndex = Math.floor(Math.random() * newMarkers.length);
        newMarkers[randomIndex].isFraud = !newMarkers[randomIndex].isFraud;
        return newMarkers;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-[400px] flex flex-col relative overflow-hidden group">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-2 z-10">
        Global Threat Heatmap
      </h3>
      <p className="text-sm text-gray-400 mb-4 z-10">Live geolocation tracking of anomalous transaction clusters.</p>
      
      <div className="relative flex-1 w-full h-full flex items-center justify-center -mt-8">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 100 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1e293b" 
                  stroke="#334155" 
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#334155", outline: "none" },
                    pressed: { fill: "#475569", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {markers.map(({ name, coordinates, markerOffset, isFraud }) => (
            <Marker key={name} coordinates={coordinates as [number, number]}>
              <circle 
                r={isFraud ? 6 : 3} 
                fill={isFraud ? "#f43f5e" : "#34d399"} 
                className={isFraud ? "animate-pulse" : ""}
                opacity={0.8}
              />
              <text
                textAnchor="middle"
                y={markerOffset}
                style={{ fontFamily: "system-ui", fill: "#94a3b8", fontSize: "10px" }}
              >
                {name}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}
