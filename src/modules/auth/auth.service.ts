import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { hashPassword, testPassword } from 'src/common/helpers/password';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';

import { AuthDto } from './dtos/auth.dto';
import { AuthModel } from './serializers/auth.serializer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<AuthModel> {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const user = await this.usersService.create(createUserDto);

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...user,
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await hashPassword(refreshToken);

    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async signIn(auth: AuthDto): Promise<AuthModel> {
    const user = await this.usersService.findByEmail(auth.email);
    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = await testPassword(auth.password, user.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const { accessToken, refreshToken } = await this.getTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { ...AuthModel.from(user), accessToken, refreshToken };
  }

  async logout(userId: any) {
    return await this.usersService.update(userId, { refreshToken: null });
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '10m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '10m',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<AuthModel> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await testPassword(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(userId, user.email);
    await this.updateRefreshToken(userId, refreshToken);
    return {
      ...AuthModel.from(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
