import { Operand } from '../value-objects/operand.value-object.js';
import { Result } from '../value-objects/result.value-object.js';
import { InvalidSquareRootError } from '../errors/invalid-square-root.error.js';

export class CalculatorService {
    add(a: Operand, b: Operand): Result {
        return Result.create(a.getValue() + b.getValue());
    }

    subtract(a: Operand, b: Operand): Result {
        return Result.create(a.getValue() - b.getValue());
    }

    multiply(a: Operand, b: Operand): Result {
        return Result.create(a.getValue() * b.getValue());
    }

    divide(a: Operand, b: Operand): Result {
        return Result.create(a.getValue() / b.getValue());
    }

    power(base: Operand, exponent: Operand): Result {
        return Result.create(Math.pow(base.getValue(), exponent.getValue()));
    }

    squareRoot(a: Operand): Result {
        if (a.getValue() < 0) {
            throw new InvalidSquareRootError();
        }
        return Result.create(Math.sqrt(a.getValue()));
    }
}