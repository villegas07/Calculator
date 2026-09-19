import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Operation, OperationType } from '../../../src/domain/value-objects/operation.value-object.js';
import { InvalidOperationError } from '../../../src/domain/errors/invalid-operation.error.js';

describe('Operation', () => {
    it('crea una operacion a partir de un tipo valido', () => {
        const operation = Operation.create(OperationType.ADDITION);
        assert.equal(operation.getType(), OperationType.ADDITION);
        assert.equal(operation.getSymbol(), '+');
    });

    it('restaura una operacion desde un valor crudo valido', () => {
        const operation = Operation.fromRawValue('DIVISION');
        assert.equal(operation.getType(), OperationType.DIVISION);
        assert.equal(operation.getSymbol(), '/');
    });

    it('rechaza un valor crudo invalido', () => {
        assert.throws(() => Operation.fromRawValue('NO_EXISTE'), InvalidOperationError);
    });
});
