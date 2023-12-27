import { IModel } from '~/common/model.interface';

export interface IUser extends IModel {
  email: string;
  firstName: null | string;
  lastName: null | string;
  password: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  refreshToken: string | null;
}
