import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';

import { hashPassword } from '~/common/helpers/password';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { UserInternalModel, UserPublicModel } from './serializers';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserPublicModel> {
    const createUser = this.userRepo.create({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
      createdAt: new Date(),
    });
    const user = await this.userRepo.save(createUser);
    return UserPublicModel.from(user);
  }

  async findAll(): Promise<UserPublicModel[]> {
    const users = await this.userRepo.find();
    return UserPublicModel.fromMany(users);
  }

  async findById(id: number): Promise<UserPublicModel> {
    const user = await this.userRepo.findOne({ where: { id } });
    return UserPublicModel.from(user);
  }

  async findByEmail(email: string): Promise<UserInternalModel> {
    const user = await this.userRepo.findOne({ where: { email } });
    return UserInternalModel.from(user);
  }

  async findUserByKey(
    where: FindOptionsWhere<IUser>,
  ): Promise<UserInternalModel> {
    const user = await this.userRepo.findOne({ where });
    return UserInternalModel.from(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserPublicModel> {
    await this.userRepo.update(id, updateUserDto);
    const user = await this.userRepo.findOne({ where: { id } });
    return UserPublicModel.from(user);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }
}
