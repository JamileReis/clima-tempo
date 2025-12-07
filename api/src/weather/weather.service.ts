import { Injectable } from '@nestjs/common';
import { WeatherRepository } from './weather.repository';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { WeatherLogDocument } from './schemas/weather-log.schema';

@Injectable()
export class WeatherService {
  constructor(private readonly repository: WeatherRepository) {}

  async createLog(dto: CreateWeatherLogDto): Promise<WeatherLogDocument> {
    const recordedAt = dto.recordedAt
      ? new Date(dto.recordedAt)
      : new Date();

    return this.repository.save({
      location: dto.location,
      temperature: dto.temperature,
      humidity: dto.humidity,
      pressure: dto.pressure ?? 0,
      source: dto.source ?? 'collector',
      windSpeed: dto.windSpeed,
      condition: dto.condition,
      recordedAt,
    });
  }

  async getCurrent(location: string) {
    const log = await this.repository.findLatestByLocation(location);
    if (!log) {
      return null;
    }

    return this.mapToCurrent(log);
  }

  async getHistory(location: string, days: number) {
    const logs = await this.repository.findHistoryByLocation(location, days);
    return logs.map((log) => this.mapToCurrent(log));
  }

  async listLogs(query: WeatherQueryDto) {
    const { location } = query;

    if (location) {
      return this.repository.findByLocation(location);
    }

    return this.repository.findAll();
  }

  private mapToCurrent(log: WeatherLogDocument) {
    return {
      location: log.location,
      temp: log.temperature,
      humidity: log.humidity,
      wind: log.windSpeed ?? 0,
      condition: log.condition ?? 'N/A',
      pressure: log.pressure,
      recordedAt: log.recordedAt,
    };
  }
}
