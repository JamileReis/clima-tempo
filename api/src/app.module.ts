import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { WeatherModule } from './weather/weather.module'
import { ExternalModule } from './external/external.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRoot(
            `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` +
            `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
        ),
        UsersModule,
        AuthModule,
        WeatherModule,
        ExternalModule,
    ],
})
export class AppModule {}
