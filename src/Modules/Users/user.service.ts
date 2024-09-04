import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./entity/user.schema";

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
}