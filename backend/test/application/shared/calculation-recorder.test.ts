import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CalculationRecorder } from '../../../src/application/shared/calculation-recorder.js';
import { Operand } from '../../../src/domain/value-objects/operand.value-object.js';
import { Operation, OperationType } from '../../../src/domain/value-objects/operation.value-object.js';
import { Result } from '../../../src/domain/value-objects/result.value-object.js';
import type { HistoryEntry } from '../../../src/domain/entities/history-entry.entity.js';
import type { CalculatorStoragePort } from '../../../src/domain/ports/calculator-storage.port.js';
import type {
    CalculatorEventHandler,
    CalculatorEventPublisherPort,
} from '../../../src/domain/ports/calculator-event-publisher.port.js';

class FakeStorage implements CalculatorStoragePort {
    readonly saved: HistoryEntry[] = [];

    async save(entry: HistoryEntry): Promise<void> {
        this.saved.push(entry);
    }

    async findAll(): Promise<readonly HistoryEntry[]> {
        return this.saved;
    }

    async clear(): Promise<void> {
        this.saved.length = 0;
    }
}

class FakeEventPublisher implements CalculatorEventPublisherPort {
    readonly published: Array<{ eventName: string; payload: unknown }> = [];

    publish(eventName: string, payload: unknown): void {
        this.published.push({ eventName, payload });
    }

    subscribe(_eventName: string, _handler: CalculatorEventHandler): void {}
}

describe('CalculationRecorder', () => {
    it('guarda la calculacion en el storage y publica el evento correspondiente', async () => {
        const storage = new FakeStorage();
        const eventPublisher = new FakeEventPublisher();
        const recorder = new CalculationRecorder(storage, eventPublisher);

        const operation = Operation.create(OperationType.ADDITION);
        const operands = [Operand.create(2), Operand.create(3)];
        const result = Result.create(5);

        const primitives = await recorder.record(operation, operands, result);

        assert.equal(primitives.result, 5);
        assert.equal(storage.saved.length, 1);
        assert.equal(eventPublisher.published.length, 1);
        assert.equal(eventPublisher.published[0]?.eventName, 'calculation.performed');
        assert.deepEqual(eventPublisher.published[0]?.payload, primitives);
    });
});
