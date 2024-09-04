import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Message } from '../../Chat/entity/message.schema';
import { User } from 'src/Modules/Users/entity/user.schema';

export type ChatRoomDocument = ChatRoom & Document;

@Schema()
export class ChatRoom {
  @Prop({ required: true })
  roomName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }], default: [] })
  messages: Message[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  users: string[]

  @Prop({ required: true })
  userHostId: string;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
