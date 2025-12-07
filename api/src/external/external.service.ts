// src/external/external.service.ts
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config' // Adicionado
import { PokemonListQueryDto } from './dto/pokemon-list-query.dto'
import { CurrentWeatherQueryDto } from './dto/current-weather-query.dto' // Adicionado

interface PokemonListResponse {
    count: number
    next: string | null
    previous: string | null
    results: { name: string; url: string }[]
}

@Injectable()
export class ExternalService {
    private readonly pokeApiUrl: string | undefined
    private readonly openWeatherUrl: string | undefined
    private readonly openWeatherKey: string | undefined

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.pokeApiUrl = this.configService.get<string>('POKE_API')
        this.openWeatherUrl = this.configService.get<string>('OPENWEATHER_API_URL')
        this.openWeatherKey = this.configService.get<string>('OPENWEATHER_API_KEY')
    }

    async listPokemons(query: PokemonListQueryDto) {
        const page = query.page ?? 1
        const limit = query.limit ?? 20
        const offset = (page - 1) * limit

        const observable = this.httpService.get<PokemonListResponse>(
            `${this.pokeApiUrl}/pokemon`,
            {
                params: { offset, limit },
            },
        )

        const { data } = await lastValueFrom(observable)
        return {
            total: data.count,
            page,
            limit,
            results: data.results,
        }
    }

    async getPokemonDetail(name: string) {
        const observable = this.httpService.get(`${this.pokeApiUrl}/pokemon/${name}`)
        const { data } = await lastValueFrom(observable)
        return data
    }

    async getCurrentWeather(query: CurrentWeatherQueryDto) {
        const observable = this.httpService.get(
            `${this.openWeatherUrl}/weather`,
            {
                params: {
                    q: query.location,
                    appid: this.openWeatherKey,
                    units: 'metric',
                    lang: 'pt_br',
                },
            },
        )
        const { data } = await lastValueFrom(observable)
        return data
    }
}
