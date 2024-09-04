import { Injectable } from "@nestjs/common";
import { CreateNewMessageDto } from "./dto/createNewMessage.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message, MessageDocument } from "./entity/message.schema";

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    ) {}
    async createNewMessage(newMessageData: CreateNewMessageDto) {
        const newMessage = new this.messageModel(
            { 
                sender: newMessageData.sender, 
                payload: newMessageData.message,
            }
        );
        const savedMessage = await newMessage.save();
        return savedMessage;
    }

    async test() {
        const message = await this.messageModel
        .findById('66d81b6c57f16cf30ab23fbd')
        .populate('sender', 'username')
        .exec();

        console.log(message);
    }
}