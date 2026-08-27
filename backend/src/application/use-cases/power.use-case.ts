import { CalculatorService } from '../../domain/services/calculator.service.js';
import { Operand } from '../../domain/value-objects/operand.value-object.js';
import { Operation, OperationType } from '../../domain/value-objects/operation.value-object.js';
import type { CalculationPrimitives } from '../../domain/entities/calculation.entity.js';
import { CalculationRecorder } from '../shared/calculation-recorder.js';


export class PowerUseCase {
    constructor(
        private readonly calculatorService: CalculatorService,
        private readonly recorder: CalculationRecorder,
    ) { }

    async execute(baseValue: number, exponentValue: number): Promise<CalculationPrimitives> {
        const base = Operand.create(baseValue);
        const exponent = Operand.create(exponentValue);
        const result = this.calculatorService.power(base, exponent);
        const operation = Operation.create(OperationType.POWER);
        return this.recorder.record(operation, [base, exponent], result);
    }
}