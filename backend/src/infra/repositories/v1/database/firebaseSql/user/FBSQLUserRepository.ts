import { container, inject, singleton } from 'tsyringe';
import { DataConnect } from 'firebase-admin/data-connect';
import { getAuth } from 'firebase-admin/auth';
import { getUserByUid } from '@dataconnect/admin-generated';
import firebaseAdmin from '../../../../../configs/FirebaseAdminConfig.ts';

import AppError from '../../../../../../app/errors/AppError.ts';
import type {
  IFBSQLUserRepository,
  IGetUserByUidInput,
  IGetUserByUidOutput,
} from '../../../../../../app/repositories/v1/database/quasagram/user/FBSQLUserRepository.ts';
import FBSQLQuasagram from '../../../../../database/firebaseSql/FBSQLQuasagram.ts';

@singleton()
class FBSQLUserRepository implements IFBSQLUserRepository {
  private fbsqlConn: DataConnect;

  constructor(@inject(FBSQLQuasagram) fbsqlQuasagram: FBSQLQuasagram) {
    this.fbsqlConn = fbsqlQuasagram.getConn();
  }

  async getUserByUid({
    uid,
  }: IGetUserByUidInput): Promise<IGetUserByUidOutput> {
    try {
      const userFromFbsql = (await getUserByUid(this.fbsqlConn, { uid })).data
        .user;

      if (!userFromFbsql) {
        throw new AppError({
          message: 'User not found',
          errorCode: 'USER_NOT_FOUND',
          internalMessage: userFromFbsql,
        });
      }

      const userFromFbAuth = await getAuth(firebaseAdmin).getUser(
        userFromFbsql.id,
      );

      const user: IGetUserByUidOutput = {
        disabled: userFromFbAuth.disabled,
        emailVerified: userFromFbAuth.emailVerified,
        uid: userFromFbAuth.uid,
        displayName: userFromFbAuth.displayName,
        email: userFromFbAuth.email,
        phoneNumber: userFromFbAuth.phoneNumber,
        photoUrl: userFromFbAuth.photoURL,
      };

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError({
        message: 'Error on getUserByUid',
        errorCode: 'ERROR_ON_getUserBiUid',
      });
    }
  }
}

container.registerSingleton('FBSQLUserRepository', FBSQLUserRepository);

export default FBSQLUserRepository;
