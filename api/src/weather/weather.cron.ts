import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { WeatherService } from './weather.service'

@Injectable()
export class WeatherCron {
    constructor(private readonly service: WeatherService) {}

    @Cron(CronExpression.EVERY_30_MINUTES)
    async run() {
        await this.service.fetchAndSave('Araci,BR')
    }
}
