import { HttpStatusCode } from "axios";

interface IAppHttpErrorInput {
  message: string;
  errorCode: string;
  statusCode: HttpStatusCode;
  errors?: object[] | string[] | undefined;
  internalMessage?: string;
}

class AppHttpError extends Error {
  public readonly errorCode: string;
  public readonly statusCode: HttpStatusCode;
  public readonly internalMessage?: string;
  public readonly errors: object[] | string[] | undefined;

  constructor({
    message,
    errorCode,
    statusCode,
    errors,
    internalMessage,
  }: IAppHttpErrorInput) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
    this.internalMessage = internalMessage;
  }
}

export default AppHttpError;
