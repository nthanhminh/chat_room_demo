import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ChatRoom, ChatRoomDocument } from "./entity/ChatRoom.schema";
import { Model, Types } from "mongoose";
import { Message } from "../Chat/entity/Message.schema";
import { CreateRoomDto } from "./dto/createRoom.dto";
import { ChatService } from "../Chat/chat.service";
import { idText } from "typescript";

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
        private chatService: ChatService
    ) {}

    async createNewRoom(createRoomDto: CreateRoomDto): Promise<ChatRoom> {
        const newRoom = new this.chatRoomModel(
            {
              ...createRoomDto,
              users: [createRoomDto.userHostId],
            }
        );
        return newRoom.save();
    }

    async getAllRooms(): Promise<ChatRoom[]> {
        const rooms = this.chatRoomModel.find();
        return rooms;
    }

    async addMessage({ roomId, sender, message }) {
        const newMessage = await this.chatService.createNewMessage({sender, message});
        const curRoom = await this.chatRoomModel.findById(roomId);
        if(!curRoom.users.includes(sender)) {
          throw new Error("User is not existing in chat room")
        }
    
        const roomUpdated = await this.chatRoomModel.findByIdAndUpdate(
          roomId,
          { $push: { messages: newMessage } },
          { new: true },
        );
    
        return "successfully";
    }

    async checkUserInRoom( {roomId, userId} ): Promise<boolean> {
      const room = await this.chatRoomModel.findById(roomId);
      return room.users.includes(userId);
    }

    async addUserIntoRoom({roomId, userId}): Promise<ChatRoom> {
        const updatedRoom = await this.chatRoomModel.findByIdAndUpdate(
          roomId, 
          {
            $addToSet: { users: userId }, 
          },
          { new: true } 
        ).exec();

        return updatedRoom;
    }

    
    async getMessagesByRoom(roomId: string) {
      const room = await this.chatRoomModel
          .findById(roomId);
          
      return room.messages ?? [];
    }
}
  
  