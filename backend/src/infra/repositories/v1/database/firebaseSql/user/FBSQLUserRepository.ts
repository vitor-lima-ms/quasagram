import { createUser, getUserByUid } from '@dataconnect/admin-generated';
import { DataConnect } from 'firebase-admin/data-connect';
import firebaseAdmin from '../../../../../configs/FirebaseAdminConfig.ts';
import { getAuth } from 'firebase-admin/auth';
import { inject, singleton } from 'tsyringe';

import AppError from '../../../../../../app/errors/AppError.ts';
import type {
  ICreateUserInput,
  ICreateUserOutput,
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

  async createUser({
    email,
    password,
    displayName,
    phoneNumber,
    profilePhoto: photoURL,
  }: ICreateUserInput): Promise<ICreateUserOutput> {
    try {
      const existingUser = await getAuth(firebaseAdmin).getUserByEmail(email);

      if (existingUser) {
        throw new AppError({
          message: `An user with e-mail ${existingUser.email} already exists`,
          errorCode: 'USER_EMAIL_ALREADY_EXISTS',
          internalMessage: String(existingUser.toJSON()),
        });
      }

      const uidFromCreatedUserInFbAuth = (
        await getAuth().createUser({
          email,
          password,
          displayName,
          phoneNumber,
          photoURL,
        })
      ).uid;

      // Equals to uidFromCreatedUserInFbAuth
      const uidFromCreatedUserInFbsql = (
        await createUser(this.fbsqlConn, { uid: uidFromCreatedUserInFbAuth })
      ).data.user_insert.uid;

      return { uid: uidFromCreatedUserInFbsql };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError({
        message: 'Error on createUser',
        errorCode: 'ERROR_ON_createUser',
      });
    }
  }

  async getUserByUid({
    uid,
  }: IGetUserByUidInput): Promise<IGetUserByUidOutput> {
    try {
      const userFromFbsql = (
        await getUserByUid(this.fbsqlConn, { uid: { uid } })
      ).data.user;

      if (!userFromFbsql) {
        throw new AppError({
          message: 'User not found',
          errorCode: 'USER_NOT_FOUND',
          internalMessage: userFromFbsql,
        });
      }

      const userFromFbAuth = await getAuth(firebaseAdmin).getUser(
        userFromFbsql.uid,
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

export default FBSQLUserRepository;
