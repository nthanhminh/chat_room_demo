import { Body, Controller, Get, Patch, Post, Query, Res } from "@nestjs/common";
import { RoomService } from "./room.service";
import { ChatRoom } from "./entity/ChatRoom.schema";
import { CreateRoomDto } from "./dto/createRoom.dto";
import { AddUserIntoRoomDto } from "./dto/addUserIntoRoom.dto";
import { createNewMessageInRoom } from "./dto/createNewMessageInRoom.dto";

@Controller('rooms')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Get()
    async getAllRooms(): Promise<ChatRoom[]> {
        return await this.roomService.getAllRooms()
    } 

    @Post()
    async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<ChatRoom> {
        return await this.roomService.createNewRoom(createRoomDto);
    }

    @Patch()
    async addUserIntoRoom(@Body() addUserIntoRoom: AddUserIntoRoomDto) {
        return await this.roomService.addUserIntoRoom(addUserIntoRoom)
    }

    @Post('chat')
    async chatting(@Body() data: createNewMessageInRoom, @Res() response) {
        try {
            const res = await this.roomService.addMessage(data);
            response.send(res);
        } catch (error) {
            response.send(error.message);
        }
    }

    @Get('chatHistory')
    async getChatHistory(@Query('roomId') roomId: string) {
       return await this.roomService.getMessagesByRoom(roomId);
    }
}   