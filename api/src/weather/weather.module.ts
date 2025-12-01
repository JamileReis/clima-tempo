import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherRepository } from './weather.repository';

import { WeatherLog, WeatherLogSchema } from './schemas/weather-log.schema';
import { InsightsService } from './insights.service';

@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([
            { name: WeatherLog.name, schema: WeatherLogSchema },
        ]),
    ],
    controllers: [WeatherController],
    providers: [WeatherService, WeatherRepository, InsightsService],
    exports: [WeatherService],
})
export class WeatherModule {}
