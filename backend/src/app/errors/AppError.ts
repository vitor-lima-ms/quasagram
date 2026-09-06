interface IAppErrorInput {
    message: string;
    errorCode: string;
    internalMessage?: string;
}

class AppError extends Error {
    public readonly errorCode: string;
    public readonly internalMessage?: string;

    constructor({ message, errorCode, internalMessage }: IAppErrorInput) {
        super(message);
        this.errorCode = errorCode;
        this.internalMessage = internalMessage;
    }
}

export default AppError;
