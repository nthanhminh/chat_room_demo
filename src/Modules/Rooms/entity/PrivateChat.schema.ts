import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Message } from '../../Chat/entity/message.schema';

export type PrivateChatDocument = PrivateChat & Document;

@Schema()
export class PrivateChat {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }], default: [] })
  messages: Message[];

  @Prop({ required: true })
  user1: string

  @Prop({ required: true })
  user2: string
}

export const PrivateChatSchema = SchemaFactory.createForClass(PrivateChat);
