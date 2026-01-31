import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Sun, CloudRain, Wind, Droplets, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TapToHear from '../../Shared/components/TapToHear';

const WeatherWidget = () => {
    const { t } = useTranslation();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Hardcoded options for now: New Delhi
                const lat = 28.6139;
                const lon = 77.2090;

                const response = await axios.get(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`
                );

                setWeather(response.data.current);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching weather:", error);
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) return <div className="h-24 bg-white dark:bg-slate-800 rounded-lg animate-pulse"></div>;

    if (!weather) return null;

    const getWeatherIcon = (code) => {
        if (code <= 3) return <Sun className="w-10 h-10 text-yellow-500" />;
        if (code <= 67) return <CloudRain className="w-10 h-10 text-blue-500" />;
        return <Cloud className="w-10 h-10 text-gray-400" />;
    };

    return (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg flex items-center justify-between">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold opacity-90">{t('weather')} ({t('newDelhi')})</h3>
                        <TapToHear text={`${t('weather')} ${t('newDelhi')}. ${weather.temperature_2m} ${t('degreeCelsius')}`} />
                    </div>
                    <Link to="/weather" className="text-xs flex items-center bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors font-bold">
                        {t('details')} <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                </div>
                <div className="flex items-center mt-2">
                    <span className="text-4xl font-bold">{weather.temperature_2m}°C</span>
                    <div className="ml-4 flex flex-col text-sm opacity-90">
                        <span className="flex items-center"><Wind className="w-4 h-4 mr-1" /> {weather.wind_speed_10m} {t('kmh')}</span>
                        <span className="flex items-center"><Droplets className="w-4 h-4 mr-1" /> {weather.relative_humidity_2m}% {t('humidity')}</span>
                    </div>
                </div>
            </div>
            <div className="ml-4">
                {getWeatherIcon(weather.weather_code)}
            </div>
        </div>
    );
};

export default WeatherWidget;
