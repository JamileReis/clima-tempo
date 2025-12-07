import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const adminEmail = this.configService.get<string>(
      'ADMIN_EMAIL',
      'admin@example.com',
    );
    const adminPassword = this.configService.get<string>(
      'ADMIN_PASSWORD',
      '123456',
    );

    try {
      const existing = await this.usersService.findByEmail(adminEmail);

      if (!existing) {
        await this.usersService.create({
          email: adminEmail,
          password: adminPassword,
          roles: ['admin'],
        });
      }
    } catch (error) {
      console.error('Error initializing admin user:', error);
    }
  }
}
