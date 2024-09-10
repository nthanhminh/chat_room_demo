import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/Modules/Users/entity/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true})
  sender: string;

  @Prop({ required: true, default: null })
  to: string;

  @Prop({ required: true })
  payload: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
