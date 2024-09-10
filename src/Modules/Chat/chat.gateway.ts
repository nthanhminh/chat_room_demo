import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../Rooms/room.service';
import { CreateNewMessageInRoomDto } from './dto/createNewMessageToRoom.dto';
import { CheckUserInRoom } from './dto/CheckUserInRoom.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Message } from './entity/message.schema';

@WebSocketGateway({ cors: { origin: '*' } }) // Customize as needed
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    protected roomService: RoomService,
    protected jwtService: JwtService,
    protected configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    try {
      const payload = this.jwtService.verify(token, { secret: this.configService.get<string>('JWT_ACCESS_SECRET'), });
      client.data.user = { userId: payload.sub, username: payload.username };
      console.log("userId", payload.sub)
      console.log(`Client connected: ${client.data.user.username}`);
    } catch (error) {
      console.error('Unauthorized client');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('loadRooms') 
  async handleLoadRoom(
    @MessageBody() data: CheckUserInRoom,
    @ConnectedSocket() client: Socket,
  ) {
    const checked = await this.roomService.checkUserInRoom(data);
    if (checked) { 
      client.join(data.roomId);
      const historyMessage = await this.roomService.getMessagesByRoom(data.roomId)
      client.emit('getHistory', historyMessage);
    } 
  }

  @SubscribeMessage('getHistory') 
  async handleGetHistory(
    @MessageBody() data: Message[],
    @ConnectedSocket() client: Socket,
  ) {
    return data;
  }

  @SubscribeMessage('sendMessageToRoom')
  async handleSendMessageToRoom(
    @MessageBody() data: CreateNewMessageInRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    await this.roomService.addMessage(data);
    this.server.to(data.roomId).emit('sendMessageToClient', {
      sender: data.sender,
      message: data.message,
    })
  }

  @SubscribeMessage('sendMessageToClient')
  async handleMessageToClient(
    @MessageBody() data: {
      sender: string,
      message: string,
    },
  ) {
    return `The sender ${data.sender} sent a new message: ${data.message}`;
  }

  @SubscribeMessage('testing')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    client.emit('responseEvent', `Day la data duoc gui guiwr veef cho phia client: ${data}`);
    return data;
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody()
    payload: {
      roomId: string
      userId: string
    },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(payload.roomId);
    const historyMessage = await this.roomService.getMessagesByRoom(payload.roomId);
    await this.roomService.addUserIntoRoom(payload);
    client.emit('getHistory', historyMessage);
    this.server.to(payload.roomId).emit('sendMessageToClient', {
      sender: "System",
      message: `client ${client.id} joined the room ${payload.roomId}`,
    });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;

    client.leave(roomId);

    this.server.to(roomId).emit('messageToClient', {
      sender: 'System',
      message: `${client.id} has left the room`,
    });
  }
}
