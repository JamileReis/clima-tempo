import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { WeatherRepository } from './weather.repository';
import { firstValueFrom } from 'rxjs';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { InsightsRequestDto } from './dto/insights-request.dto';
import { InsightsService } from './insights.service';

@Injectable()
export class WeatherService {
    private readonly logger = new Logger(WeatherService.name);
    private readonly apiKey = process.env.OPENWEATHER_API_KEY;
    private readonly apiUrl = process.env.OPENWEATHER_API_URL;

    constructor(
        private readonly http: HttpService,
        private readonly repo: WeatherRepository,
        private readonly insights: InsightsService,
    ) {}

    async getInsights(location: string | undefined) {
        if (!location) {
            throw new HttpException('location is required', HttpStatus.BAD_REQUEST);
        }

        const url = `${this.apiUrl}/weather?q=${location}&appid=${this.apiKey}&units=metric`;

        let weather;
        try {
            const { data } = await firstValueFrom(this.http.get(url));
            weather = data;
        } catch (e) {
            throw new HttpException('failed to fetch weather', HttpStatus.BAD_GATEWAY);
        }

        const log = {
            location,
            temperature: weather.main.temp,
            humidity: weather.main.humidity,
            pressure: weather.main.pressure ?? null,
            source: 'openweather',
            recordedAt: new Date(),
        };

        await this.repo.save(log);

        const logs = await this.repo.findByLocation(location);

        const temps = logs.map(l => l.temperature);
        const hums = logs.map(l => l.humidity);

        const summary: InsightsRequestDto = {
            location,
            count: logs.length,
            avgTemperature: this.avg(temps),
            minTemperature: Math.min(...temps),
            maxTemperature: Math.max(...temps),
            avgHumidity: this.avg(hums),
            trend: 'unknown',
        };

        const aiSummary = await this.insights.generateInsight(summary);

        return { ...summary, aiSummary };
    }

    private avg(arr: number[]) {
        return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    }

    async generateInsights(dto: InsightsRequestDto) {
        return {
            ...dto,
            aiSummary: await this.insights.generateInsight(dto),
        };
    }

    async createLog(dto: CreateWeatherLogDto) {
        return this.repo.save({
            ...dto,
            recordedAt: new Date(),
            source: dto.source ?? 'manual',
        });
    }

    async listLogs(query: WeatherQueryDto) {
        if (query.location) {
            return this.repo.findByLocation(query.location);
        }
        return this.repo.findAll();
    }
}