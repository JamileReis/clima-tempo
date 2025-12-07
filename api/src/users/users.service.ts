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

        const passwordHash = await bcrypt.hash(dto.password, this.saltRounds)

        return this.usersRepository.create({
            email: dto.email,
            passwordHash,
            roles: dto.roles ?? ['user'],
        })
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
        const updatePayload: any = { ...dto }

        if (dto.password) {
            updatePayload.passwordHash = await bcrypt.hash(dto.password, this.saltRounds)
            delete updatePayload.password
        }

        const updated = await this.usersRepository.update(id, updatePayload)

        if (!updated) {
            throw new NotFoundException('User not found')
        }

        return updated
    }

    async remove(id: string): Promise<void> {
        const deleted = await this.usersRepository.delete(id)
        if (!deleted) {
            throw new NotFoundException('User not found')
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findByEmail(email)
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }
}
