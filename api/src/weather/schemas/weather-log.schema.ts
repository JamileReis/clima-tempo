import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WeatherLogDocument = WeatherLog & Document;

@Schema({ collection: 'weather_logs' })
export class WeatherLog {
  @Prop({ required: true })
  location!: string;

  @Prop({ required: true })
  temperature!: number;

  @Prop({ required: true })
  humidity!: number;

  @Prop({ required: true })
  source!: string;

  @Prop({ required: true })
  pressure!: number;

  @Prop({ required: false })
  windSpeed?: number;

  @Prop({ required: false })
  condition?: string;

  @Prop({ required: true })
  recordedAt!: Date;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
