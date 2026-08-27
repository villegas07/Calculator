import { InvalidOperationError } from "../errors/invalid-operation.error.js";

export enum OperationType {
    ADDITION = 'ADDITION',
    SUBTRACTION = 'SUBTRACTION',
    MULTIPLICATION = 'MULTIPLICATION',
    DIVISION = 'DIVISION',
    POWER = 'POWER',
    SQUARE_ROOT = 'SQUARE_ROOT',
}

const OPERATION_SYMBOLS: Record<OperationType, string> = {
    [OperationType.ADDITION]: '+',
    [OperationType.SUBTRACTION]: '-',
    [OperationType.MULTIPLICATION]: '*',
    [OperationType.DIVISION]: '/',
    [OperationType.POWER]: '^',
    [OperationType.SQUARE_ROOT]: '√',
};

const OPERATION_TYPE_VALUES: readonly string[] = Object.values(OperationType);

export class Operation {
    private constructor(private readonly type: OperationType) {}

    static create(type: OperationType): Operation {
        return new  Operation(type);
    }

    static fromRawValue(value: string): Operation{
        return new Operation(parseOperationType(value));
    }

    getType(): OperationType {
        return this.type;
    }

    getSymbol(): string {
        return OPERATION_SYMBOLS[this.type];
    }
}

function isOperationType(value: string): value  is OperationType {
    return OPERATION_TYPE_VALUES.includes(value);
}

function parseOperationType(value: string): OperationType {
    if (!isOperationType(value)) {
        throw new InvalidOperationError(`El tipo de operación "${value}" no es válido`);
    }
    return value;
}