import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./entity/user.schema";
import { CreateUserDto } from "./dto/create_user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel : Model<UserDocument>
    ) {}

    async createNewUser(userName: string) : Promise<UserDocument> {
        const newUser = new this.userModel(
            {
                userName,
                socketId: "",
            }
        );
        return newUser.save();
    }

    async updateSocketId({socketId, userId}): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(userId, {socketId}, { new: true }).exec();
    }

    async getUsers() : Promise<UserDocument[]> {
        return await this.userModel.find();
    }

    async findUserById(userId: string): Promise<UserDocument> {
        return this.userModel.findById(userId);
    }

    async findUserByUserName(userName: string): Promise<UserDocument> {
        return this.userModel.findOne({
            userName: userName
        });
    }

    async create(createUserDto: CreateUserDto) {
        return await this.userModel.create(createUserDto);
    }
}