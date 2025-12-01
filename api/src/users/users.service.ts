import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { UsersRepository } from './users.repository'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './schemas/user.schema'

@Injectable()
export class UsersService {
    private readonly saltRounds = 10

    constructor(private readonly usersRepository: UsersRepository) {}

    async create(dto: CreateUserDto): Promise<User> {
        const existing = await this.usersRepository.findByEmail(dto.email)
        if (existing) {
            throw new ConflictException('Email already in use')
        }
        const password = await bcrypt.hash(dto.password, this.saltRounds)
        return this.usersRepository.create({ ...dto, password })
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.findAll()
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findById(id)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async update(id: string, dto: UpdateUserDto): Promise<User> {
        const payload: UpdateUserDto = { ...dto }
        if (dto.password) {
            payload.password = await bcrypt.hash(dto.password, this.saltRounds)
        }
        const user = await this.usersRepository.update(id, payload)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async remove(id: string): Promise<void> {
        const deleted = await this.usersRepository.delete(id)
        if (!deleted) {
            throw new NotFoundException('User not found')
        }
    }

    async validateCredentials(email: string, password: string): Promise<User | null> {
        const user = await this.usersRepository.findByEmail(email)
        if (!user) return null
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return null
        return user
    }
}
