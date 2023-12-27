import { UserPublicModel } from '~/modules/user/serializers';

export class AuthModel extends UserPublicModel {
  accessToken: string;
}
