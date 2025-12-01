import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { ExternalService } from './external.service'
import { ExternalController } from './external.controller'

@Module({
    imports: [HttpModule, ConfigModule],
    controllers: [ExternalController],
    providers: [ExternalService],
    exports: [ExternalService],
})
export class ExternalModule {}