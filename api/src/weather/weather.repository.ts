import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from './schemas/weather-log.schema';

@Injectable()
export class WeatherRepository {
    constructor(
        @InjectModel(WeatherLog.name)
        private readonly model: Model<WeatherLogDocument>,
    ) {}

    async save(data: Partial<WeatherLog>) {
        const log = new this.model(data);
        return log.save();
    }

    async findByLocation(location: string) {
        return this.model.find({ location }).sort({ recordedAt: -1 }).exec();
    }

    async findAll() {
        return this.model.find().sort({ recordedAt: -1 }).exec();
    }
}
