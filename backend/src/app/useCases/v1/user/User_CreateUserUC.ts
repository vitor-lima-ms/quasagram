import { inject, injectable } from 'tsyringe';

import type { IFBSQLUserRepository } from '../../../repositories/v1/database/quasagram/user/FBSQLUserRepository.ts';

interface IInput {
  email: string;
  password: string;
  displayName?: string;
  profilePhoto?: string;
  phoneNumber?: string;
}

// interface IOutput {
//   uid: string;
// }

@injectable()
class CreateUser {
  private fbsqlUserRepository: IFBSQLUserRepository;

  constructor(
    @inject('FBSQLUserRepository')
    fbsqlUserRepository: IFBSQLUserRepository,
  ) {
    this.fbsqlUserRepository = fbsqlUserRepository;
  }

  async execute({
    email,
    password,
    displayName,
    phoneNumber,
    profilePhoto,
  }: IInput): Promise<void> {
    // const user = this.fbsqlUserRepository.createUser({
    //   email,
    //   password,
    //   displayName,
    //   phoneNumber,
    //   profilePhoto,
    // });

    // return user;

    this.fbsqlUserRepository.createUser({
      email,
      password,
      displayName,
      phoneNumber,
      profilePhoto,
    });
  }
}

export default CreateUser;
