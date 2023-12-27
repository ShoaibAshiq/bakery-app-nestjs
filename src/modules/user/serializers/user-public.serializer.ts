import { Exclude, instanceToPlain, plainToInstance } from 'class-transformer';
import { IUser } from '../interfaces/user.interface';

export class UserPublicModel implements IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  updatedAt: Date;
  createdAt: Date;
  refreshToken: string;

  @Exclude()
  password: string;

  constructor(user: Partial<UserPublicModel>) {
    Object.assign(this, user);
  }

  // get fullName(): string {
  //   return `${this.firstName} ${this.lastName}`;
  // }

  static from(user: IUser): UserPublicModel {
    return plainToInstance(UserPublicModel, instanceToPlain(user));
  }

  static fromMany(users: IUser[]): UserPublicModel[] {
    return users.map((user) => this.from(user));
  }
}
