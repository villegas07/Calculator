import { randomUUID } from "crypto";
import { Operand } from "../value-objects/operand.value-object.js";
import { Operation } from "../value-objects/operation.value-object.js";
import { Result } from "../value-objects/result.value-object.js";

export interface CalculationPrimitives {
    readonly id: string;
    readonly operation: string;
    readonly symbol: string;
    readonly operands: readonly number[];
    readonly result: number;
    readonly performedAt: string;
}


export class Calculation {
    private constructor(
        private readonly id: string,
        private readonly operation: Operation,
        private readonly operands: readonly Operand[],
        private readonly result: Result,
        private readonly performedAt: Date
    ){}

    static create(operation: Operation, operands: readonly Operand[], result: Result): Calculation {
        return new Calculation(randomUUID(), operation, operands, result, new Date());
    }


    static restore(
        id: string,
        operation: Operation,
        operands: readonly Operand[],
        result: Result,
        performedAt: Date
    ): Calculation {
        return new Calculation(id, operation, operands, result, performedAt);
    }

    toPrimitives(): CalculationPrimitives {
        return {
            id: this.id,
            operation: this.operation.getType(),
            symbol: this.operation.getSymbol(),
            operands: this.operands.map((operand) => operand.getValue()),
            result: this.result.getValue(),
            performedAt: this.performedAt.toISOString(),
        };
    }
}