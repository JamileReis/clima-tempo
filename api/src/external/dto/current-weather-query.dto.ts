import { IsNotEmpty, IsString } from 'class-validator'

export class CurrentWeatherQueryDto {
    @IsNotEmpty()
    @IsString()
    location!: string
}