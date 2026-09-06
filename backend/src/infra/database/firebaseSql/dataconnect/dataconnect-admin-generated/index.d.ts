import {
  ConnectorConfig,
  DataConnect,
  OperationOptions,
  ExecuteOperationResponse,
} from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;

export interface GetUserByUidData {
  user?: { username: string; email: string };
}

export interface GetUserByUidVariables {
  uid: string;
}

export interface Post_Key {
  id: UUIDString;
  __typename?: 'Post_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'GetUserByUid' Query. Allow users to execute without passing in DataConnect. */
export function getUserByUid(
  dc: DataConnect,
  vars: GetUserByUidVariables,
  options?: OperationOptions,
): Promise<ExecuteOperationResponse<GetUserByUidData>>;
/** Generated Node Admin SDK operation action function for the 'GetUserByUid' Query. Allow users to pass in custom DataConnect instances. */
export function getUserByUid(
  vars: GetUserByUidVariables,
  options?: OperationOptions,
): Promise<ExecuteOperationResponse<GetUserByUidData>>;
