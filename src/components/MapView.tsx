import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Place } from '../types';
import { X, Navigation } from 'lucide-react';

interface MapViewProps {
  places: Place[];
  onClose: () => void;
}

export default function MapView({ places, onClose }: MapViewProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Semera center
  const defaultCenter = { lat: 11.7917, lng: 41.0000 };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  if (!apiKey) {
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 max-w-md">
          <h3 className="text-xl font-bold text-stone-900 mb-4">የካርታ ቁልፍ አልተገኘም (API Key Missing)</h3>
          <p className="text-stone-600 mb-6">
            ካርታውን ለመጠቀም እባክዎ የGoogle Maps API ቁልፍ በቅንብሮች ውስጥ ያስገቡ።
            (Please provide a Google Maps API key in settings to use the map.)
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors"
          >
            ተመለስ (Go Back)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col">
      <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
            <Navigation size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900 leading-tight">የሰመራ ካርታ (Semera Map)</h3>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">አካባቢዎን እና መዳረሻዎችን ይመልከቱ</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-stone-900"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 relative">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={14}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
            mapId="bf51a910020fa25a" // Optional: Use a custom map ID if you have one
          >
            {places.map((place) => (
              place.lat && place.lng && (
                <Marker
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  onClick={() => setSelectedPlace(place)}
                  title={place.name}
                />
              )
            ))}

            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                  fillColor: '#ef4444',
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: '#ffffff',
                  scale: 2,
                }}
                title="Your Location"
              />
            )}

            {selectedPlace && selectedPlace.lat && selectedPlace.lng && (
              <InfoWindow
                position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div className="p-2 max-w-[200px]">
                  <h4 className="font-bold text-stone-900 text-sm mb-1">{selectedPlace.name}</h4>
                  <p className="text-stone-500 text-xs">{selectedPlace.category}</p>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
