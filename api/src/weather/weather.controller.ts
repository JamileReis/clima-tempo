import {
    Controller,
    Get,
    Post,
    Query,
    Body,
    UseGuards,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { WeatherService } from './weather.service';
import { WeatherQueryDto } from './dto/weather-query.dto';
import { CreateWeatherLogDto } from './dto/create-weather-log.dto';
import { InsightsRequestDto } from './dto/insights-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get('insights')
    async getInsightsAuto(@Query() query: WeatherQueryDto) {
        return this.weatherService.getInsights(query.location);
    }

    @UseGuards(JwtAuthGuard)
    @Post('insights')
    async getInsightsManual(@Body() dto: InsightsRequestDto) {
        return this.weatherService.generateInsights(dto);
    }

    @Post('logs')
    async createLog(@Body() dto: CreateWeatherLogDto) {
        return this.weatherService.createLog(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('logs')
    async listLogs(@Query() query: WeatherQueryDto) {
        return this.weatherService.listLogs(query);
    }

    @UseGuards(JwtAuthGuard)
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

        const rows = logs.map((log) => [
            log.source,
            log.location,
            log.temperature,
            log.humidity,
            log.pressure,
            new Date(log.recordedAt).toISOString(),
        ]);

        const lines = [
            header.join(','),
            ...rows.map(row => row.map(v => `"${v}"`).join(',')),
        ];

        const csv = lines.join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="weather_logs.csv"');

        return res.send(csv);
    }
    @UseGuards(JwtAuthGuard)
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

        logs.forEach((log) => {
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