import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RoomService } from "../Rooms/room.service";
import { ChatGateway } from "./chat.gateway";
import { ConnectedSocket, MessageBody, SubscribeMessage } from "@nestjs/websockets";
import { Socket } from "socket.io";

export class ChatPrivate extends ChatGateway {
    messageModel: any;
    constructor(
        protected roomService: RoomService,
        protected jwtService: JwtService,
        protected configService: ConfigService,
    ) {
        super(roomService,jwtService, configService);
    }

    @SubscribeMessage('chatPrivateMessage')
    async handlePrivateMessage(
        @MessageBody() data: { content: string, to: string, privateChatId: string},
        @ConnectedSocket() client: Socket,
    ) {
    const sender = client.data.user.userId;
    const receiverId = data.to;
    const content = data.content;
    const privateChatId = data.privateChatId;


    console.log("receiverId", receiverId);
    await this.roomService.pushChatMessage({
        sender: sender, 
        to: receiverId, 
        privateChatId: privateChatId,
        message: content
    });

    client.to(privateChatId).emit('chatPrivateMessage', { content, from: sender.userId });
  }

  @SubscribeMessage('joinPrivateChat')
  async handleJoinPrivateChat(
    @MessageBody()
    payload: {
      privateChatId: string
    },
    @ConnectedSocket() client: Socket,
  ) {
    const privateChatId = payload.privateChatId;
    try {
        const chatRoom = await this.roomService.findPrivateChatById(privateChatId)
        if(!chatRoom) {
            throw new Error('private chat room is not exist');
        }
    } catch (error) {
        console.log(error)
    }
    client.join(privateChatId);
    const historyMessage = await this.roomService.getHistoryMessage(privateChatId);
    client.emit('getHistory', historyMessage);
  }
}

