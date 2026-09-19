import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Calculation } from '../../../src/domain/entities/calculation.entity.js';
import { Operand } from '../../../src/domain/value-objects/operand.value-object.js';
import { Operation, OperationType } from '../../../src/domain/value-objects/operation.value-object.js';
import { Result } from '../../../src/domain/value-objects/result.value-object.js';

describe('Calculation', () => {
    it('crea una calculacion y expone sus primitivas', () => {
        const operation = Operation.create(OperationType.ADDITION);
        const operands = [Operand.create(2), Operand.create(3)];
        const result = Result.create(5);

        const calculation = Calculation.create(operation, operands, result);
        const primitives = calculation.toPrimitives();

        assert.equal(primitives.operation, OperationType.ADDITION);
        assert.equal(primitives.symbol, '+');
        assert.deepEqual(primitives.operands, [2, 3]);
        assert.equal(primitives.result, 5);
        assert.ok(primitives.id.length > 0);
        assert.ok(!Number.isNaN(new Date(primitives.performedAt).getTime()));
    });

    it('restaura una calculacion con id y fecha conocidos', () => {
        const operation = Operation.create(OperationType.MULTIPLICATION);
        const operands = [Operand.create(4), Operand.create(5)];
        const result = Result.create(20);
        const performedAt = new Date('2024-01-01T00:00:00.000Z');

        const calculation = Calculation.restore('fixed-id', operation, operands, result, performedAt);
        const primitives = calculation.toPrimitives();

        assert.equal(primitives.id, 'fixed-id');
        assert.equal(primitives.performedAt, performedAt.toISOString());
    });
});
