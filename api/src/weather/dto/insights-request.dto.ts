import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class InsightsRequestDto {
  @IsOptional()
  @IsString()
  location: string = '';

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  count: number = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  avgTemperature: number = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minTemperature: number = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxTemperature: number = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  avgHumidity: number = 0;

  @IsOptional()
  @IsString()
  trend: string = '';
}
