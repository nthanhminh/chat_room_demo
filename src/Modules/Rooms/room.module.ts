import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from '../Rooms/entity/ChatRoom.schema';
import { RoomService } from './room.service';
import { ChatModule } from '../Chat/chat.module';
import { RoomController } from './room.controller';
import { PrivateChat, PrivateChatSchema } from './entity/PrivateChat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatRoom.name, schema: ChatRoomSchema }]),
    MongooseModule.forFeature([{ name: PrivateChat.name, schema: PrivateChatSchema }]),
    forwardRef(() => ChatModule),
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
