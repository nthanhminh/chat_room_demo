import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { UserDocument } from "./entity/user.schema";
import { UserService } from "./user.service";
import { UpdateSocketIdDto } from "./dto/updateSocketId.dto";
import { CreateUserDto } from "./dto/create_user.dto";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    async createNewUser(@Body() createUserDto: CreateUserDto): Promise<UserDocument> {
        return await this.userService.create(createUserDto);
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