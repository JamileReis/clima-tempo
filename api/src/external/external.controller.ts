import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ExternalService } from './external.service'
import { PokemonListQueryDto } from './dto/pokemon-list-query.dto'
import { CurrentWeatherQueryDto } from './dto/current-weather-query.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@Controller('external')
@UseGuards(JwtAuthGuard)
export class ExternalController {
    constructor(private readonly externalService: ExternalService) {}

    @Get('pokemon')
    list(@Query() query: PokemonListQueryDto) {
        return this.externalService.listPokemons(query)
    }

    @Get('pokemon/:name')
    detail(@Param('name') name: string) {
        return this.externalService.getPokemonDetail(name)
    }

    @Get('weather/current')
    currentWeather(@Query() query: CurrentWeatherQueryDto) {
        return this.externalService.getCurrentWeather(query)
    }
}
