import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Cloud, Sun, CloudRain, Wind, Droplets,
    Thermometer, Calendar, Clock, Navigation,
    ArrowLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Shared/components/Loader';

const WeatherForecast = () => {
    const navigate = useNavigate();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetailedWeather = async () => {
            try {
                const lat = 28.6139; // New Delhi
                const lon = 77.2090;

                const response = await axios.get(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max&timezone=auto`
                );

                setWeatherData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching detailed weather:", err);
                setError("Failed to load weather data. Please try again later.");
                setLoading(false);
            }
        };

        fetchDetailedWeather();
    }, []);

    if (loading) return <Loader fullScreen={false} />;

    if (error) return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-red-900 dark:text-red-400">{error}</h3>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
                Retry
            </button>
        </div>
    );

    const getWeatherIcon = (code, size = "w-6 h-6") => {
        if (code <= 3) return <Sun className={`${size} text-yellow-500`} />;
        if (code <= 67) return <CloudRain className={`${size} text-blue-500`} />;
        return <Cloud className={`${size} text-slate-400`} />;
    };

    const getAgriAdvice = (daily) => {
        const advice = [];
        const maxWind = Math.max(...weatherData.hourly.wind_speed_10m.slice(0, 24));
        const rainProb = Math.max(...weatherData.hourly.precipitation_probability.slice(0, 24));

        if (maxWind > 15) {
            advice.push({
                title: "Avoid Spraying",
                text: "Wind speeds are high today. Avoid spraying pesticides or fertilizers to prevent drift.",
                type: "warning"
            });
        }
        if (rainProb > 40) {
            advice.push({
                title: "Check Irrigation",
                text: "Significant chance of rain detected. You might want to delay your irrigation schedule.",
                type: "info"
            });
        }
        if (daily.uv_index_max[0] > 7) {
            advice.push({
                title: "High UV Warning",
                text: "Intense solar radiation today. Ensure adequate hydration for yourself and monitor sensitive crops.",
                type: "warning"
            });
        }

        if (advice.length === 0) {
            advice.push({
                title: "Ideal Conditions",
                text: "Weather conditions are stable. Great day for general field work and harvesting.",
                type: "success"
            });
        }

        return advice;
    };

    const recommendations = getAgriAdvice(weatherData.daily);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Weather Forecast</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Detailed outlook for New Delhi, India</p>
                </div>
            </div>

            {/* Current Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Thermometer className="w-5 h-5 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Temp Range</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {weatherData.daily.temperature_2m_min[0]}° - {weatherData.daily.temperature_2m_max[0]}°C
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Humidity</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {weatherData.hourly.relative_humidity_2m[new Date().getHours()]}%
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Wind className="w-5 h-5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wind Speed</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {weatherData.hourly.wind_speed_10m[new Date().getHours()]} km/h
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Sun className="w-5 h-5 text-yellow-500" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max UV</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {weatherData.daily.uv_index_max[0]}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 7-Day Forecast */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            <h3 className="font-bold text-slate-900 dark:text-white">Weekly Outlook</h3>
                        </div>
                        <div className="divide-y divide-slate-50 dark:divide-slate-700">
                            {weatherData.daily.time.map((date, index) => (
                                <div key={date} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div className="w-24">
                                        <div className="font-bold text-slate-900 dark:text-white">
                                            {index === 0 ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getWeatherIcon(weatherData.daily.weather_code[index])}
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            {weatherData.daily.weather_code[index] <= 3 ? 'Clear' : 'Overcast'}
                                        </span>
                                    </div>
                                    <div className="flex gap-4 text-sm">
                                        <span className="font-bold text-slate-900 dark:text-white">{weatherData.daily.temperature_2m_max[index]}°</span>
                                        <span className="text-slate-400">{weatherData.daily.temperature_2m_min[index]}°</span>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1 text-xs text-blue-500 font-medium w-16">
                                        <CloudRain className="w-3 h-3" />
                                        {weatherData.daily.precipitation_sum[index]}mm
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hourly Trends (Condensed) */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-6 text-emerald-600">
                            <Clock className="w-5 h-5" />
                            <h3 className="font-bold text-slate-900 dark:text-white">Next 24 Hours</h3>
                        </div>
                        <div className="flex overflow-x-auto pb-4 gap-8 no-scrollbar">
                            {weatherData.hourly.time.slice(new Date().getHours(), new Date().getHours() + 24).map((time, idx) => {
                                const realIdx = new Date().getHours() + idx;
                                return (
                                    <div key={time} className="flex flex-col items-center min-w-[40px] gap-2">
                                        <span className="text-xs text-slate-400">
                                            {new Date(time).getHours()}:00
                                        </span>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                                            {weatherData.hourly.temperature_2m[realIdx]}°
                                        </div>
                                        <div className="text-[10px] text-blue-500 font-bold">
                                            {weatherData.hourly.precipitation_probability[realIdx]}%
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Agri Recommendations */}
                <div className="space-y-6">
                    <div className="bg-emerald-600 p-6 rounded-xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10 flex flex-col gap-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Navigation className="w-5 h-5" /> Agri-Planner
                            </h3>
                            <div className="space-y-4">
                                {recommendations.map((rec, i) => (
                                    <div key={i} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                                        <h4 className="text-sm font-black text-white mb-1 uppercase tracking-wider">{rec.title}</h4>
                                        <p className="text-xs text-white/90 leading-relaxed">{rec.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Today's Details</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Max Wind Gust</span>
                                <span className="font-bold dark:text-white">{Math.max(...weatherData.hourly.wind_speed_10m.slice(0, 24))} km/h</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Rain Prob. (Peak)</span>
                                <span className="font-bold text-blue-500">{Math.max(...weatherData.hourly.precipitation_probability.slice(0, 24))}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Sun Intensity</span>
                                <span className="font-bold text-yellow-600">{weatherData.daily.uv_index_max[0]} / 12</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherForecast;
