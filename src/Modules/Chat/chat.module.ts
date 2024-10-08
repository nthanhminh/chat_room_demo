import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './entity/message.schema';
import { ChatGateway } from './chat.gateway';
import { UserModule } from '../Users/user.module';
import { RoomModule } from '../Rooms/room.module';
import { ChatController } from './chat.controller';
import { ChatPrivate } from './chat_private.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    forwardRef(() => RoomModule),
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, ChatPrivate],
  exports: [ChatService, MongooseModule],
})
export class ChatModule {}
