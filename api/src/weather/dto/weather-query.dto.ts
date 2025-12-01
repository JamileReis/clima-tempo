import { IsOptional, IsString } from 'class-validator';

export class WeatherQueryDto {
    @IsOptional()
    @IsString()
    location?: string;
}