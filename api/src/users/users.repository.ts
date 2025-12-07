import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    create(data: Partial<User>): Promise<User> {
        const created = new this.userModel(data)
        return created.save()
    }

    findAll(): Promise<User[]> {
        return this.userModel.find().exec()
    }

    findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec()
    }

    findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec()
    }

    update(id: string, data: Partial<User>): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec()
    }

    delete(id: string): Promise<User | null> {
        return this.userModel.findByIdAndDelete(id).exec()
    }
}
