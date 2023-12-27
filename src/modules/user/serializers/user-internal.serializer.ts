import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IUser } from '../interfaces/user.interface';

export class UserInternalModel implements IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  updatedAt: Date;
  createdAt: Date;
  refreshToken: string;
  password: string;

  constructor(user: Partial<UserInternalModel>) {
    Object.assign(this, user);
  }

  // get fullName(): string {
  //   return `${this.firstName} ${this.lastName}`;
  // }

  static from(user: IUser): UserInternalModel {
    return plainToInstance(UserInternalModel, instanceToPlain(user));
  }

  static fromMany(users: IUser[]): UserInternalModel[] {
    return users.map((user) => this.from(user));
  }
}
