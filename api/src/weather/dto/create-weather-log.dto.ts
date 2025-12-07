import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateWeatherLogDto {
  @IsString()
  location!: string;

  @IsNumber()
  temperature!: number;

  @IsNumber()
  humidity!: number;

  @IsOptional()
  @IsNumber()
  pressure?: number;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsNumber()
  windSpeed?: number;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsString()
  recordedAt?: string;
}
