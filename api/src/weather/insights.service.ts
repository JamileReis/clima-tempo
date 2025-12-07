import { Injectable } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Injectable()
export class InsightsService {
  constructor(private readonly weatherService: WeatherService) {}

  async generateInsights(location: string, days: number): Promise<{ main: string }> {
    const history = await this.weatherService.getHistory(location, days);

    if (!history.length) {
      return {
        main: `Nenhum dado de clima encontrado para ${location} nos últimos ${days} dias.`,
      };
    }

    const temps = history.map((h) => h.temp);
    const avg =
      temps.reduce((acc, t) => acc + t, 0) / (temps.length || 1);

    const max = Math.max(...temps);
    const min = Math.min(...temps);
    const last = history[history.length - 1];

    const text = [
      `Temperatura média nos últimos ${history.length} registros: ${avg.toFixed(
        1,
      )}°C.`,
      `Máxima: ${max}°C, mínima: ${min}°C.`,
      `Condição atual: ${last.condition} em ${last.location}.`,
    ].join(' ');

    return { main: text };
  }

  async generateManual(dto: {
    location?: string;
    count?: number;
    avgTemperature?: number;
    minTemperature?: number;
    maxTemperature?: number;
    avgHumidity?: number;
    trend?: string;
  }): Promise<{ main: string }> {
    const parts: string[] = [];

    if (dto.location) {
      parts.push(`Local: ${dto.location}.`);
    }

    if (dto.count && dto.count > 0) {
      parts.push(`Total de registros analisados: ${dto.count}.`);
    }

    if (
      dto.avgTemperature !== undefined &&
      dto.minTemperature !== undefined &&
      dto.maxTemperature !== undefined
    ) {
      parts.push(
        `Temperatura média: ${dto.avgTemperature.toFixed(
          1,
        )}°C (mínima: ${dto.minTemperature}°C, máxima: ${dto.maxTemperature}°C).`,
      );
    }

    if (dto.avgHumidity !== undefined) {
      parts.push(`Umidade média: ${dto.avgHumidity.toFixed(1)}%.`);
    }

    if (dto.trend) {
      parts.push(`Tendência: ${dto.trend}.`);
    }

    const main =
      parts.length > 0
        ? parts.join(' ')
        : 'Nenhum dado suficiente para gerar insights manuais.';

    return { main };
  }
}
