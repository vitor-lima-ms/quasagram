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
    username: string;
    email: string;
}

export interface IFBSQLUserRepository {
    getUserByUid(input: IGetUserByUidInput): Promise<IGetUserByUidOutput>;
}
