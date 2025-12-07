import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './login';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isMatch = await this.usersService.comparePassword(
      password,
      (user as any).passwordHash,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    const userId =
      (user as any).id ??
      (user as any)._id?.toString();

    const payload: JwtPayload = {
      sub: userId,
      email: (user as any).email,
      roles: (user as any).roles,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: userId,
        email: (user as any).email,
        roles: (user as any).roles,
      },
    };
  }
}
