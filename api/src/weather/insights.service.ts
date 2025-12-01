import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InsightsRequestDto } from './dto/insights-request.dto';

@Injectable()
export class InsightsService {
    private readonly apiKey = process.env.GEMINI_API_KEY;
    private readonly apiUrl = process.env.GEMINI_API_URL;

    constructor(private readonly http: HttpService) {}

    async generateInsight(payload: InsightsRequestDto): Promise<string> {
        try {

            const body = {
                contents: [
                    {
                        parts: [
                            {
                                text: `Gere um resumo climático baseado nos dados:
Location: ${payload.location}
Mean Temperature: ${payload.avgTemperature}
Min Temperature: ${payload.minTemperature}
Max Temperature: ${payload.maxTemperature}
Humidity: ${payload.avgHumidity}
Trend: ${payload.trend}
Produza um texto claro e objetivo.`
                            },
                        ],
                    },
                ],
            };

            const { data } = await firstValueFrom(
                this.http.post(`${this.apiUrl}?key=${this.apiKey}`, body)
            );

            return data?.candidates?.[0]?.content?.parts?.[0]?.text ??
                'Resumo de IA indisponível.';
        } catch (exception) {
            const error = exception as Error
            console.log(error.message, 'erro aqui')
            return 'Falha ao gerar o resumo de IA. Verifique a configuração do Gemini.';
        }
    }
}