import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    create(dto: CreateUserDto): Promise<User> {
        const created = new this.userModel(dto)
        return created.save()
    }

    findAll(): Promise<User[]> {
        return this.userModel.find().lean().exec()
    }

    findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec()
    }

    findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec()
    }

    update(id: string, dto: UpdateUserDto): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec()
    }

    delete(id: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(id).exec()
    }
}
