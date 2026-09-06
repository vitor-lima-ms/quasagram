export interface ICreateUserInput {
  email: string;
  password: string;
}
export interface ICreateUserOutput {
  email: string;
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
  getUserByUid(input: IGetUserByUidInput): Promise<IGetUserByUidOutput>;
}
