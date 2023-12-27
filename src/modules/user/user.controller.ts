import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserPublicModel } from './serializers';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserPublicModel> {
    const alreadyExist = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (alreadyExist) {
      throw new ForbiddenException('User with this email already exits');
    }
    return await this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<UserPublicModel[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserPublicModel> {
    const user = await this.usersService.findById(+id);
    if (!user) {
      throw new NotFoundException('user does not Exist');
    }
    return user;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserPublicModel> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findById(+id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.usersService.remove(+id);
  }
}
