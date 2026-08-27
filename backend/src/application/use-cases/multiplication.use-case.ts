import { CalculatorService } from '../../domain/services/calculator.service.js';
import { Operand } from '../../domain/value-objects/operand.value-object.js';
import { Operation } from '../../domain/value-objects/operation.value-object.js';
import { OperationType } from '../../domain/value-objects/operation.value-object.js';
import type { CalculationPrimitives } from '../../domain/entities/calculation.entity.js';
import { CalculationRecorder } from '../shared/calculation-recorder.js';

export class MultiplicationUseCase {
    constructor(
        private readonly calculatorService: CalculatorService,
        private readonly recorder: CalculationRecorder,
    ) {}

    async execute(firstValue: number, secondValue: number): Promise<CalculationPrimitives> {
        const a = Operand.create(firstValue);
        const b = Operand.create(secondValue);
        const result = this.calculatorService.multiply(a, b);
        const operation = Operation.create(OperationType.MULTIPLICATION);
        return this.recorder.record(operation, [a, b], result);
    }
}
