export interface WeatherCurrentResponse {
    location: string;
    temp: number;
    humidity: number | undefined;
    wind: number;
    condition: string;
    pressure?: number;
    recordedAt?: Date;
}
