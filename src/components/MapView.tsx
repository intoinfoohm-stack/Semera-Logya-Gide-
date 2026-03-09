import React, { useState, useEffect, useMemo } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { Place } from '../types';
import { X, Navigation, MapPin, Filter, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface MapViewProps {
  places: Place[];
  onClose: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  "አስተዳደር (Administration)": "#2563eb", // Blue
  "ጤና (Health)": "#16a34a", // Green
  "ቱሪዝም (Tourism)": "#ea580c", // Orange
  "ትምህርት (Education)": "#9333ea", // Purple
  "ንግድ (Commerce)": "#ca8a04", // Amber
};

const DEFAULT_COLOR = "#57534e"; // Stone-600

// Helper to calculate distance in km
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default function MapView({ places, onClose }: MapViewProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Semera center
  const defaultCenter = { lat: 11.7917, lng: 41.0000 };

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus('granted');
      },
      (error) => {
        console.error("Error getting user location:", error);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('denied');
        } else {
          setLocationStatus('idle');
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const filteredPlaces = useMemo(() => {
    if (!showNearbyOnly || !userLocation) return places;
    
    // Filter places within 5km of user
    return places.filter(place => {
      if (!place.lat || !place.lng) return false;
      const dist = getDistance(userLocation.lat, userLocation.lng, place.lat, place.lng);
      return dist <= 5; // 5km radius
    });
  }, [places, showNearbyOnly, userLocation]);

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
    <div className="fixed inset-0 z-[200] bg-[#0a192f] flex flex-col">
      <div className="p-4 border-b border-[#00f2ff]/20 flex items-center justify-between bg-[#0a192f]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#112240] border border-[#00f2ff] rounded-xl flex items-center justify-center text-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.2)]">
            <Navigation size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#00f2ff] leading-tight font-ethiopic">የሰመራ ካርታ (Semera Map)</h3>
            <p className="text-[10px] text-[#00f2ff]/50 font-bold uppercase tracking-widest">አካባቢዎን እና መዳረሻዎችን ይመልከቱ</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNearbyOnly(!showNearbyOnly)}
            disabled={!userLocation}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest border-2",
              showNearbyOnly 
                ? "bg-[#00f2ff] border-[#00f2ff] text-[#0a192f] shadow-[0_0_20px_rgba(0,242,255,0.4)]" 
                : "bg-[#112240] border-[#00f2ff]/30 text-[#00f2ff] hover:border-[#00f2ff] hover:bg-[#00f2ff]/5",
              !userLocation && "opacity-30 cursor-not-allowed"
            )}
          >
            <Filter size={14} />
            <span>{showNearbyOnly ? "ሁሉንም አሳይ" : "አቅራቢያ (5km)"}</span>
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#00f2ff]/10 rounded-full transition-colors text-[#00f2ff]/50 hover:text-[#00f2ff]"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-[#0a192f]">
        {/* Location Permission Prompt/Error */}
        <AnimatePresence>
          {locationStatus === 'denied' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-[210] w-[90%] max-w-md"
            >
              <div className="bg-[#112240]/95 backdrop-blur-md border border-red-500/30 p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-500/10 text-red-500 rounded-lg shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">የቦታ ፈቃድ ተከልክሏል (Location Denied)</h4>
                    <p className="text-[9px] text-white/60 leading-relaxed font-bold">
                      አቅራቢያዎ ያሉ ቦታዎችን ለማየት የቦታ ፈቃድ ያስፈልጋል። ይህ ፈቃድ 'አቅራቢያ' የሚለውን ማጣሪያ ለመጠቀም አስፈላጊ ነው።
                      (Location permission is required for the 'nearby' filter to work correctly. Please enable it in your browser settings.)
                    </p>
                  </div>
                  <button onClick={() => setLocationStatus('idle')} className="text-white/30 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {locationStatus === 'idle' && !userLocation && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-[210] w-[90%] max-w-md"
            >
              <div className="bg-[#112240]/95 backdrop-blur-md border border-[#00f2ff]/30 p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#00f2ff]/10 text-[#00f2ff] rounded-lg shrink-0">
                    <Navigation size={18} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] font-bold text-[#00f2ff] uppercase tracking-widest mb-0.5">ቦታዎን ያጋሩ (Share Location)</h4>
                    <p className="text-[8px] text-[#00f2ff]/50 uppercase tracking-wider">ለተሻለ አገልግሎት ቦታዎን ይፍቀዱ</p>
                  </div>
                  <button 
                    onClick={requestLocation}
                    className="px-4 py-2 bg-[#00f2ff] text-[#0a192f] text-[9px] font-bold rounded-lg hover:bg-white transition-all uppercase tracking-widest"
                  >
                    ፍቀድ (Allow)
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={14}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
            mapId="bf51a910020fa25a"
            styles={[
              {
                "elementType": "geometry",
                "stylers": [{ "color": "#1d2c4d" }]
              },
              {
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#8ec3b9" }]
              },
              {
                "elementType": "labels.text.stroke",
                "stylers": [{ "color": "#1a3646" }]
              },
              {
                "featureType": "administrative.country",
                "elementType": "geometry.stroke",
                "stylers": [{ "color": "#4b6878" }]
              },
              {
                "featureType": "landscape.man_made",
                "elementType": "geometry.stroke",
                "stylers": [{ "color": "#334e87" }]
              },
              {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{ "color": "#283d6a" }]
              },
              {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{ "color": "#304a7d" }]
              },
              {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#0e1626" }]
              }
            ]}
          >
            {filteredPlaces.map((place) => (
              place.lat && place.lng && (
                <Marker
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  onClick={() => setSelectedPlace(place)}
                  title={place.name}
                  icon={{
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                    fillColor: CATEGORY_COLORS[place.category] || DEFAULT_COLOR,
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: '#ffffff',
                    scale: 1.5,
                  }}
                />
              )
            ))}

            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                  fillColor: '#00f2ff',
                  fillOpacity: 1,
                  strokeWeight: 3,
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
                <div className="p-3 max-w-[220px] bg-white rounded-lg">
                  <h4 className="font-bold text-stone-900 text-sm mb-1 font-ethiopic">{selectedPlace.name}</h4>
                  <p className="text-orange-600 text-[10px] font-bold uppercase tracking-wider mb-2">{selectedPlace.category}</p>
                  {selectedPlace.description && (
                    <p className="text-stone-600 text-[11px] leading-relaxed border-t border-stone-100 pt-2">
                      {selectedPlace.description}
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
        
        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-[#112240]/90 backdrop-blur-md p-5 rounded-2xl border border-[#00f2ff]/30 shadow-[0_0_30px_rgba(0,0,0,0.3)] z-10 hidden md:block">
          <h4 className="text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest mb-4 border-b border-[#00f2ff]/10 pb-2">መለያዎች (Legend)</h4>
          <div className="space-y-3">
            {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
              <div key={category} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)]" style={{ backgroundColor: color }} />
                <span className="text-[11px] font-bold text-[#00f2ff] tracking-tight">{category.split(' (')[0]}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-1 border-t border-[#00f2ff]/10">
              <div className="w-3 h-3 rounded-full bg-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
              <span className="text-[11px] font-bold text-[#00f2ff] tracking-tight">የእርስዎ ቦታ (You)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
