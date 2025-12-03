import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://root:root@mongodb:27017', {
      retryAttempts: 10,
      retryDelay: 5000,
    }),
    UsersModule,
    WeatherModule,
  ],
})
export class AppModule {}