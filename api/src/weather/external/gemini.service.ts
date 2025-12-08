import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class GeminiService {
    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService,
    ) {}

    async generate(text: string): Promise<string> {
        const url = `${this.config.get('GEMINI_API_URL')}?key=${this.config.get('GEMINI_API_KEY')}`

        const body = {
            contents: [
                {
                    parts: [{ text }],
                },
            ],
        }

        const res = await firstValueFrom(this.http.post(url, body))
        return res.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sem resposta.'
    }
}