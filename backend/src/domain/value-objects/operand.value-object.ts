import { InvalidOperationError } from '../errors/invalid-operation.error.js';

export class Operand {
    private constructor(private readonly value: number) {}

    static create(value: number): Operand {
        if (!Number.isFinite(value)) {
            throw new InvalidOperationError(`El operador "${value}" no es un número válido`);
        }
        return new Operand(value);
    }

    getValue(): number {
        return this.value;
    }

    equals(other: Operand): boolean {
        return this.value === other.value;
    }
}