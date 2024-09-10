import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import crypto from 'crypto';
import { UserService } from '../Users/user.service';
import { CreateUserDto } from '../Users/dto/create_user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.usersService.findUserByUserName(
      createUserDto.userName,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(
      newUser._id.toString(),
      newUser.userName,
    );
    return tokens;
  }

  async signIn(data: AuthDto) {
    const user = await this.usersService.findUserByUserName(data.userName);
    if (!user) throw new BadRequestException('User does not exist');
    // const passwordMatches = await argon2.verify(user.password, data.password);
    const passwordMatches = user.password === data.password
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user._id.toString(), user.userName);
    return tokens;
  }

  async logout(userId: string) {
    // return this.usersService.update(userId, { refreshToken: null });
  }

  generateEmailToken() {
    const randomString = crypto
      .randomBytes(length)
      .toString('hex')
      .slice(0, length);
    return randomString;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  // async updateRefreshToken(userId: string, refreshToken: string) {
  //   const hashedRefreshToken = await this.hashData(refreshToken);
  //   await this.usersService.update(userId, {
  //     refreshToken: hashedRefreshToken,
  //   });
  // }

  async getTokens(userId: string, username: string) {
    console.log("userId: " + userId);
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '7d',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    // const user = await this.usersService.findById(userId);
    const user = null;
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user._id, user.userName);
    return tokens;
  }
}
