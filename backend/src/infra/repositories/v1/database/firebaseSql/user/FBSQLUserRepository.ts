import { createUser, getUserByUid } from '@dataconnect/admin-generated';
import { DataConnect } from 'firebase-admin/data-connect';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import { inject, singleton } from 'tsyringe';
import { randomUUID } from 'node:crypto';

import AppError from '../../../../../../app/errors/AppError.ts';
import firebaseAdmin from '../../../../../configs/FirebaseAdminConfig.ts';
import type {
  ICreateUserInput,
  ICreateUserOutput,
  IFBSQLUserRepository,
  IGetUserByUidInput,
  IGetUserByUidOutput,
} from '../../../../../../app/repositories/v1/database/quasagram/user/FBSQLUserRepository.ts';
import isJpeg from '../../../../../../app/utils/isJpeg.ts';
import FBSQLQuasagram from '../../../../../database/firebaseSql/FBSQLQuasagram.ts';

@singleton()
class FBSQLUserRepository implements IFBSQLUserRepository {
  private fbsqlConn: DataConnect;
  private readonly firebaseAuth = getAuth(firebaseAdmin);
  private readonly firestoreBucket = getStorage(firebaseAdmin).bucket();

  constructor(@inject(FBSQLQuasagram) fbsqlQuasagram: FBSQLQuasagram) {
    this.fbsqlConn = fbsqlQuasagram.getConn();
  }

  private async getUserFromFirebaseAuth(
    email: string,
  ): Promise<UserRecord | null> {
    try {
      const user = await this.firebaseAuth.getUserByEmail(email);

      return user;
    } catch {
      return null;
    }
  }

  async createUser({
    email,
    password,
    displayName,
    phoneNumber,
    profilePhoto,
  }: ICreateUserInput): Promise<ICreateUserOutput> {
    // I move here to have access inside the catch block
    const profilePhotoFileName = `${email}_profilePhoto`;

    try {
      const existingUser = await this.getUserFromFirebaseAuth(email);

      if (existingUser) {
        throw new AppError({
          message: `An user with e-mail ${existingUser.email} already exists`,
          errorCode: 'USER_EMAIL_ALREADY_EXISTS',
        });
      }

      const profilePhotoNotUndefined = profilePhoto!; // The Busboy middleware ensure that profilePhoto !== undefined
      const profilePhotoFile = this.firestoreBucket.file(profilePhotoFileName);
      const downloadToken = randomUUID();
      await profilePhotoFile.save(profilePhotoNotUndefined, {
        metadata: {
          contentType: isJpeg(profilePhotoNotUndefined)
            ? 'image/jpeg'
            : 'image/png',
          metadata: { firebaseStorageDownloadTokens: downloadToken },
        },
      });
      const photoURL = await getDownloadURL(profilePhotoFile);

      if (!photoURL) {
        await profilePhotoFile.delete();

        throw new AppError({
          message: `Error on retrieve baseUrl from uploaded profilePhoto`,
          errorCode: 'BASE_URL_FOR_USER_PROFILE_PHOTO_IS_UNDEFINED',
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
      await this.firebaseAuth.deleteUser((await this.getUserFromFirebaseAuth(email))!.uid); // uid cant be undefine because we already create the user above

      await this.firestoreBucket
        .file(profilePhotoFileName)
        .delete({ ignoreNotFound: true });

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
