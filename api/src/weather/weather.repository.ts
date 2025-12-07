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

  async save(data: Partial<WeatherLog>): Promise<WeatherLogDocument> {
    const log = new this.model(data);
    return log.save();
  }

  async findByLocation(location: string): Promise<WeatherLogDocument[]> {
    return this.model.find({ location }).sort({ recordedAt: -1 }).exec();
  }

  async findAll(): Promise<WeatherLogDocument[]> {
    return this.model.find().sort({ recordedAt: -1 }).exec();
  }

  async findLatestByLocation(
    location: string,
  ): Promise<WeatherLogDocument | null> {
    return this.model
      .findOne({ location })
      .sort({ recordedAt: -1 })
      .exec();
  }

  async findHistoryByLocation(
    location: string,
    days: number,
  ): Promise<WeatherLogDocument[]> {
    const from = new Date();
    from.setDate(from.getDate() - days);

    return this.model
      .find({
        location,
        recordedAt: { $gte: from },
      })
      .sort({ recordedAt: 1 })
      .exec();
  }
}
