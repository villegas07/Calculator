import { CalculatorService } from '../../domain/services/calculator.service.js';
import { Operand } from '../../domain/value-objects/operand.value-object.js';
import { Operation } from '../../domain/value-objects/operation.value-object.js';
import { OperationType } from '../../domain/value-objects/operation.value-object.js';
import type { CalculationPrimitives } from '../../domain/entities/calculation.entity.js';
import { CalculationRecorder } from '../shared/calculation-recorder.js';

export class SubtractionUseCase {
    constructor(
        private readonly calculatorService: CalculatorService,
        private readonly recorder: CalculationRecorder,
    ) { }

    async execute(minuend: number, subtrahend: number): Promise<CalculationPrimitives> {
        const a = Operand.create(minuend);
        const b = Operand.create(subtrahend);
        const result = this.calculatorService.subtract(a, b);
        const operation = Operation.create(OperationType.SUBTRACTION);
        return this.recorder.record(operation, [a, b], result);
    }
}