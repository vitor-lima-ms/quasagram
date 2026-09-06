import { inject, singleton } from "tsyringe";

import type { IFBSQLUserRepository } from "../../../repositories/v1/database/quasagram/user/FBSQLUserRepository.ts";

interface IInput {
  uid: string;
}

interface IOutput {
  username: string;
  email: string;
}

@singleton()
class GetUserById {
  private fbsqlUserRepository: IFBSQLUserRepository;

  constructor(
    @inject("FBSQLUserRepository")
    fbsqlUserRepository: IFBSQLUserRepository,
  ) {
    this.fbsqlUserRepository = fbsqlUserRepository;
  }

  async execute({ uid }: IInput): Promise<IOutput> {
    const user = this.fbsqlUserRepository.getUserByUid({ uid });

    return user;
  }
}

export default GetUserById;
