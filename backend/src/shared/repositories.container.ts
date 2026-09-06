import { container } from 'tsyringe';

import type { IFBSQLUserRepository } from '../app/repositories/v1/database/quasagram/user/FBSQLUserRepository.ts';
import FBSQLUserRepository from '../infra/repositories/v1/database/firebaseSql/user/FBSQLUserRepository.ts';

container.registerSingleton<IFBSQLUserRepository>(
  'FBSQLUserRepository',
  FBSQLUserRepository,
);
