import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { WeatherRepository } from './weather.repository';
import { InsightsService } from './insights.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherLog, WeatherLogSchema } from './schemas/weather-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeatherLog.name, schema: WeatherLogSchema },
    ]),
  ],
  controllers: [WeatherController],
  providers: [
    WeatherService,
    WeatherRepository,
    InsightsService,
  ],
  exports: [
    WeatherService,
    WeatherRepository,
    InsightsService,  
  ],
})
export class WeatherModule {}
