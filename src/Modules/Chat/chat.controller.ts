import { Controller, Get } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('chatting') 
export class ChatController {
    constructor(private chatService: ChatService) {}
    @Get()
    async test() {
        return await this.chatService.test();
    }
}