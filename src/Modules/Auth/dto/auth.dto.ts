/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ description: 'userName' })
  userName: string;

  @ApiProperty({ description: 'password' })
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'The access token for the user' })
  accessToken: string;

  @ApiProperty({ description: 'The refresh token for the user' })
  refreshToken: string;
}
