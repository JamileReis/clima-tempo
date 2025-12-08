import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenWeatherClient {
    private readonly apiKey = process.env.OPENWEATHER_API_KEY;
    private readonly baseUrl = process.env.OPENWEATHER_BASE_URL ?? 'https://api.openweathermap.org/data/2.5';

    async getCurrentWeather(location: string) {
        const url = `${this.baseUrl}/weather`;

        const response = await axios.get(url, {
            params: {
                q: location,
                units: 'metric',
                lang: 'pt_br',
                appid: this.apiKey,
            },
        });

        return response.data;
    }

    async getHistory(lat: number, lon: number, timestamp: number) {
        const url = `${this.baseUrl}/onecall/timemachine`;

        const response = await axios.get(url, {
            params: {
                lat,
                lon,
                dt: timestamp,
                units: 'metric',
                lang: 'pt_br',
                appid: this.apiKey,
            },
        });

        return response.data;
    }
}
