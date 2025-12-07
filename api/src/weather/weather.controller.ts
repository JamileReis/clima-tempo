import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { WeatherService } from './weather.service';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';
import { InsightsRequestDto } from './dto/insights-request.dto';
import { InsightsService } from './insights.service';

@Controller('weather')
export class WeatherController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly insightsService: InsightsService,
  ) {}

  @Post('logs')
  async createLog(@Body() dto: CreateWeatherLogDto) {
    const log = await this.weatherService.createLog(dto);
    return {
      id: log.id,
      location: log.location,
      temperature: log.temperature,
      humidity: log.humidity,
      pressure: log.pressure,
      source: log.source,
      windSpeed: log.windSpeed,
      condition: log.condition,
      recordedAt: log.recordedAt,
    };
  }

  @Get('current')
  async getCurrent(@Query() query: WeatherQueryDto) {
    const location = query.location ?? 'Araci, BA';
    return this.weatherService.getCurrent(location);
  }

  @Get('history')
  async getHistory(@Query() query: WeatherQueryDto) {
    const location = query.location ?? 'Araci, BA';
    const days = query.days ?? 2;
    return this.weatherService.getHistory(location, days);
  }

  @Get('logs')
  async listLogs(@Query() query: WeatherQueryDto) {
    return this.weatherService.listLogs(query);
  }

  @Get('insights')
  async getInsightsAuto(@Query() query: WeatherQueryDto) {
    const location = query.location ?? 'Araci, BA';
    const days = query.days ?? 2;
    return this.insightsService.generateInsights(location, days);
  }

  @Post('insights')
  async getInsightsManual(@Body() dto: InsightsRequestDto) {
    return this.insightsService.generateManual(dto);
  }

  @Get('export.csv')
  async exportCsv(@Query() query: WeatherQueryDto, @Res() res: Response) {
    const logs = await this.weatherService.listLogs(query);

    const header = [
      'source',
      'location',
      'temperature',
      'humidity',
      'pressure',
      'recordedAt',
    ];

    const rows = logs.map((log: any) => [
      log.source,
      log.location,
      log.temperature,
      log.humidity,
      log.pressure,
      new Date(log.recordedAt).toISOString(),
    ]);

    const lines = [
      header.join(','),
      ...rows.map((row) => row.map((v) => `"${v}"`).join(',')),
    ];

    const csv = lines.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="weather_logs.csv"',
    );

    return res.send(csv);
  }

  @Get('export.xlsx')
  async exportXlsx(@Query() query: WeatherQueryDto, @Res() res: Response) {
    const logs = await this.weatherService.listLogs(query);

    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Weather Logs');

    sheet.addRow([
      'source',
      'location',
      'temperature',
      'humidity',
      'pressure',
      'recordedAt',
    ]);

    logs.forEach((log: any) => {
      sheet.addRow([
        log.source,
        log.location,
        log.temperature,
        log.humidity,
        log.pressure,
        new Date(log.recordedAt).toISOString(),
      ]);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="weather_logs.xlsx"',
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
