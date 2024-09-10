import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModule } from './Modules/Rooms/room.module';
import { UserModule } from './Modules/Users/user.module';
import { ChatModule } from './Modules/Chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './Modules/Auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat_room'),
    ChatModule,
    RoomModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the config available globally without needing to import it in every module
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MongooseModule],
})
export class AppModule {}
