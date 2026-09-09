export interface ICreateUserInput {
  email: string;
  password: string;
  displayName?: string;
  profilePhoto?: Buffer;
  phoneNumber?: string;
}
export interface ICreateUserOutput {
  uid: string;
}

export interface IGetUserByUidInput {
  uid: string;
}
export interface IGetUserByUidOutput {
  email?: string;
  emailVerified: boolean;
  displayName?: string;
  photoUrl?: string;
  phoneNumber?: string;
  disabled: boolean;
  uid: string;
}

export interface IFBSQLUserRepository {
  createUser(input: ICreateUserInput): Promise<ICreateUserOutput>;
  getUserByUid(input: IGetUserByUidInput): Promise<IGetUserByUidOutput>;
}
