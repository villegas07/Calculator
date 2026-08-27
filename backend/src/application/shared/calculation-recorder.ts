import type { Calculation, CalculationPrimitives } from '../../domain/entities/calculation.entity.js';
import { HistoryEntry } from '../../domain/entities/history-entry.entity.js';
import { Operand } from '../../domain/value-objects/operand.value-object.js';
import { Operation } from '../../domain/value-objects/operation.value-object.js';
import { Result } from '../../domain/value-objects/result.value-object.js';
import type { CalculatorStoragePort } from '../../domain/ports/calculator-storage.port.js';
import type { CalculatorEventPublisherPort } from '../../domain/ports/calculator-event-publisher.port.js';

const CALCULATION_PERFORMED_EVENT = 'calculation.performed';

export class CalculationRecorder {
    constructor(
        private readonly storage: CalculatorStoragePort,
        private readonly eventPublisher: CalculatorEventPublisherPort
    ) {}

    async record(
        operation: Operation,
        operands: readonly Operand[],
        result: Result,
    ): Promise<CalculationPrimitives> {
        const calculation = Calculation.create(operation, operands, result);
        await this.storage.save(HistoryEntry.fromCalculation(calculation));
        this.eventPublisher.publish(CALCULATION_PERFORMED_EVENT, calculation.toPrimitives());
        return calculation.toPrimitives();
    }
}