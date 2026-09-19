import { InvalidOperationError } from '../errors/invalid-operation.error.js';

export class Result {
    private constructor(private readonly value: number) {}

    static create(value: number): Result {
        if (!Number.isFinite(value)) {
            throw new InvalidOperationError('El resultado calculado no es un número válido');
        }
        return new Result(value);
    }

    getValue(): number {
        return this.value;
    }
}
