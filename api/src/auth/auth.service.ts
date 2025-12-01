import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { JwtPayload } from './jwt-payload.interface'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(dto: LoginDto) {
        const user = await this.usersService.validateCredentials(dto.email, dto.password)
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }
        const payload: JwtPayload = {
            sub: (user as any)._id.toString(),
            email: user.email,
            roles: user.roles,
        }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
