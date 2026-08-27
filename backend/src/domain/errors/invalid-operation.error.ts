export class InvalidOperationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidOperationError';
        object.setPrototypeOf(this, InvalidOperationError.prototype);
    }
}