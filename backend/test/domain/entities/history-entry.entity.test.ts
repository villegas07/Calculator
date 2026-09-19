import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { HistoryEntry } from '../../../src/domain/entities/history-entry.entity.js';
import { Calculation } from '../../../src/domain/entities/calculation.entity.js';
import { Operand } from '../../../src/domain/value-objects/operand.value-object.js';
import { Operation, OperationType } from '../../../src/domain/value-objects/operation.value-object.js';
import { Result } from '../../../src/domain/value-objects/result.value-object.js';

function buildCalculation(): Calculation {
    return Calculation.create(
        Operation.create(OperationType.SUBTRACTION),
        [Operand.create(9), Operand.create(4)],
        Result.create(5),
    );
}

describe('HistoryEntry', () => {
    it('se crea a partir de una calculacion', () => {
        const entry = HistoryEntry.fromCalculation(buildCalculation());
        const primitives = entry.toPrimitives();

        assert.equal(primitives.calculation.result, 5);
        assert.ok(primitives.id.length > 0);
        assert.ok(!Number.isNaN(new Date(primitives.createdAt).getTime()));
    });

    it('se restaura con id y fecha conocidos', () => {
        const createdAt = new Date('2024-06-01T12:00:00.000Z');
        const entry = HistoryEntry.restore('entry-id', buildCalculation(), createdAt);
        const primitives = entry.toPrimitives();

        assert.equal(primitives.id, 'entry-id');
        assert.equal(primitives.createdAt, createdAt.toISOString());
    });
});
