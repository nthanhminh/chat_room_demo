import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  userName: string

  @Prop({ required: true })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User);
