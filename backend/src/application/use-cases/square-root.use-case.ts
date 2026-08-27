import { CalculatorService } from '../../domain/services/calculator.service.js';
import { Operand } from '../../domain/value-objects/operand.value-object.js';
import { Operation, OperationType } from '../../domain/value-objects/operation.value-object.js';
import type { CalculationPrimitives } from '../../domain/entities/calculation.entity.js';
import { CalculationRecorder } from '../shared/calculation-recorder.js';

export class SquareRootUseCase {
    constructor(
        private readonly calculatorService: CalculatorService,
        private readonly recorder: CalculationRecorder,
    ) { }

    async execute(value: number): Promise<CalculationPrimitives> {
        const a = Operand.create(value);
        const result = this.calculatorService.squareRoot(a);
        const operation = Operation.create(OperationType.SQUARE_ROOT);
        return this.recorder.record(operation, [a], result);
    }
}