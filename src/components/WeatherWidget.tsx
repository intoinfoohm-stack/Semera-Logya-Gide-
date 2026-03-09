import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Thermometer, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    windSpeed: number;
    humidity: number;
  };
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
  }>;
}

const SEMERA_LAT = 11.79;
const SEMERA_LON = 41.01;

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${SEMERA_LAT}&longitude=${SEMERA_LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa%2FAddis_Ababa`
        );
        
        if (!response.ok) throw new Error('Weather data unavailable');
        
        const data = await response.json();
        
        const weatherMap: Record<number, { label: string; icon: React.ReactNode }> = {
          0: { label: 'Clear sky', icon: <Sun className="text-yellow-400" /> },
          1: { label: 'Mainly clear', icon: <Sun className="text-yellow-300" /> },
          2: { label: 'Partly cloudy', icon: <Cloud className="text-stone-400" /> },
          3: { label: 'Overcast', icon: <Cloud className="text-stone-500" /> },
          45: { label: 'Fog', icon: <Cloud className="text-stone-300" /> },
          48: { label: 'Depositing rime fog', icon: <Cloud className="text-stone-300" /> },
          51: { label: 'Light drizzle', icon: <CloudRain className="text-blue-300" /> },
          61: { label: 'Slight rain', icon: <CloudRain className="text-blue-400" /> },
          80: { label: 'Rain showers', icon: <CloudRain className="text-blue-500" /> },
          95: { label: 'Thunderstorm', icon: <CloudLightning className="text-purple-500" /> },
        };

        const getWeatherInfo = (code: number) => weatherMap[code] || { label: 'Unknown', icon: <Cloud /> };

        setWeather({
          current: {
            temp: Math.round(data.current.temperature_2m),
            condition: getWeatherInfo(data.current.weather_code).label,
            windSpeed: data.current.wind_speed_10m,
            humidity: data.current.relative_humidity_2m,
          },
          forecast: data.daily.time.slice(1, 4).map((time: string, index: number) => ({
            date: new Date(time).toLocaleDateString('en-US', { weekday: 'short' }),
            maxTemp: Math.round(data.daily.temperature_2m_max[index + 1]),
            minTemp: Math.round(data.daily.temperature_2m_min[index + 1]),
            condition: getWeatherInfo(data.daily.weather_code[index + 1]).label,
          })),
        });
      } catch (err) {
        setError('Failed to load weather');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-pulse w-full max-w-sm">
      <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-white/20 rounded w-3/4"></div>
    </div>
  );

  if (error || !weather) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl text-white w-full max-w-md"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-orange-400 mb-1">Semera Weather</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">{weather.current.temp}°C</span>
            <span className="text-orange-100/70 text-sm font-medium">{weather.current.condition}</span>
          </div>
        </div>
        <div className="p-3 bg-orange-500/20 rounded-2xl">
          <Sun size={32} className="text-orange-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
          <Wind size={18} className="text-orange-300" />
          <div>
            <p className="text-[10px] text-white/50 uppercase font-bold">Wind</p>
            <p className="text-sm font-semibold">{weather.current.windSpeed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
          <Thermometer size={18} className="text-orange-300" />
          <div>
            <p className="text-[10px] text-white/50 uppercase font-bold">Humidity</p>
            <p className="text-sm font-semibold">{weather.current.humidity}%</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest flex items-center gap-2">
          <Calendar size={12} />
          3-Day Forecast
        </p>
        <div className="grid grid-cols-3 gap-2">
          {weather.forecast.map((day, i) => (
            <div key={i} className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
              <p className="text-xs font-bold mb-1">{day.date}</p>
              <p className="text-lg font-bold">{day.maxTemp}°</p>
              <p className="text-[10px] text-white/40">{day.minTemp}°</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
