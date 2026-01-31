import { FastifyPluginAsync } from 'fastify';
import { badRequest } from '../../../utils/errors.js';

export const weatherRoutes: FastifyPluginAsync = async (app) => {
  app.get('/current', async (req) => {
    const q = req.query as any;
    const lat = Number(q.lat);
    const lon = Number(q.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw badRequest('lat and lon are required numbers');

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(String(lat))}&longitude=${encodeURIComponent(String(lon))}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return { message: 'Weather provider error' };
    const data: any = await res.json();

    return {
      item: {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        current: data.current,
      }
    };
  });

  app.get('/forecast', async (req) => {
    const q = req.query as any;
    const lat = Number(q.lat);
    const lon = Number(q.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw badRequest('lat and lon are required numbers');

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(String(lat))}&longitude=${encodeURIComponent(String(lon))}&hourly=temperature_2m,precipitation_probability,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return { message: 'Weather provider error' };
    const data: any = await res.json();

    return {
      item: {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        hourly: data.hourly,
        daily: data.daily,
      }
    };
  });
};
