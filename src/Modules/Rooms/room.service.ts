import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ChatRoom, ChatRoomDocument } from "./entity/ChatRoom.schema";
import { Model } from "mongoose";
import { CreateRoomDto } from "./dto/createRoom.dto";
import { ChatService } from "../Chat/chat.service";
import { PrivateChat, PrivateChatDocument } from "./entity/PrivateChat.schema";
import { CreateNewPrivateChatDto } from "./dto/createNewPrivateChat.dto";
import { FindPrivateChatDto } from "./dto/findPrivateChat.dto";
import { CreateNewMessageDto } from "../Chat/dto/createNewMessage.dto";
import { CreateNewMessageToPrivateChatDto } from "../Chat/dto/createNewMessageToPrivateChat.dto";

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
        @InjectModel(PrivateChat.name) private privateChatModel: Model<PrivateChatDocument>,
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

    async createNewPrivateChat(createNewPrivateChatDto: CreateNewPrivateChatDto): Promise<PrivateChat> {
      const newRoom = new this.privateChatModel(
          {
            // user1: createNewPrivateChatDto.user1,
            // user2: createNewPrivateChatDto.user2
            ...createNewPrivateChatDto
          }
      );
      return newRoom.save();
    }

    async findPrivateChatById(id: string): Promise<PrivateChat> {
      return await this.privateChatModel.findById(id);
    }

    async findPrivateChatByParticipant(findPrivateChatDto: FindPrivateChatDto) {
      let privateChat = await this.privateChatModel.findOne({
        user1: findPrivateChatDto.user1,
        user2: findPrivateChatDto.user2,
      })

      if(!privateChat) {
        privateChat = await this.privateChatModel.findOne({
          user1: findPrivateChatDto.user2,
          user2: findPrivateChatDto.user1,
        })
      }

      return privateChat;
    }

    async getHistoryMessage(privateChatId: string) {
      const privateChat = await this.findPrivateChatById(privateChatId);
      return privateChat.messages ?? [];
    }

    async pushChatMessage(createNewMessageToPrivateChatDto: CreateNewMessageToPrivateChatDto) {
      const newMessage = await this.chatService.createNewMessage({
        sender: createNewMessageToPrivateChatDto.sender,
        to: createNewMessageToPrivateChatDto.to,
        message: createNewMessageToPrivateChatDto.message
      });
        const privateChatUpdated = await this.privateChatModel.findByIdAndUpdate(
          createNewMessageToPrivateChatDto.privateChatId,
          { $push: { messages: newMessage } },
          { new: true },
        );
    
        return "successfully";
    }
}
  
  