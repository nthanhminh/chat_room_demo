import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { UserDocument } from "./entity/user.schema";
import { UserService } from "./user.service";
import { UpdateSocketIdDto } from "./dto/updateSocketId.dto";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async createNewUser(@Body('userName') userName: string): Promise<UserDocument> {
        return await this.userService.createNewUser(userName);
    }

    @Get()
    async getAllUsers(): Promise<UserDocument[]> {
        return await this.userService.getUsers();
    }

    @Patch()
    async updateUser(@Body() updateSocketId: UpdateSocketIdDto) {
        return await this.userService.updateSocketId(updateSocketId);
    }
}