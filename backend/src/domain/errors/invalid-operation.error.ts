export class InvalidOperationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidOperationError';
        Object.setPrototypeOf(this, InvalidOperationError.prototype);
    }
}