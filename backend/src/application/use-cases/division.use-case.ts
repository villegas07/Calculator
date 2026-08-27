import { CalculatorService } from '../../domain/services/calculator.service.js';
import { Operand } from '../../domain/value-objects/operand.value-object.js';
import { Operation } from '../../domain/value-objects/operation.value-object.js';
import { OperationType } from '../../domain/value-objects/operation.value-object.js';
import type { CalculationPrimitives } from '../../domain/entities/calculation.entity.js';
import { CalculationRecorder } from '../shared/calculation-recorder.js';

export class DivisionUseCase {
    constructor(
        private readonly calculatorService: CalculatorService,
        private readonly recorder: CalculationRecorder,
    ) { }

    async execute(dividend: number, divisor: number): Promise<CalculationPrimitives> {
        const a = Operand.create(dividend);
        const b = Operand.create(divisor);
        const result = this.calculatorService.divide(a, b);
        const operation = Operation.create(OperationType.DIVISION);
        return this.recorder.record(operation, [a, b], result);
    }
}