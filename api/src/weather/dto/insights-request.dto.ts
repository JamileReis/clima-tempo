import { IsString, IsNumber } from 'class-validator';

export class InsightsRequestDto {
    @IsString()
    location: string;

    @IsNumber()
    count: number;

    @IsNumber()
    avgTemperature: number;

    @IsNumber()
    minTemperature: number;

    @IsNumber()
    maxTemperature: number;

    @IsNumber()
    avgHumidity: number;

    @IsString()
    trend: string;
}