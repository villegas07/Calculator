import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Operand } from '../../../src/domain/value-objects/operand.value-object.js';
import { InvalidOperationError } from '../../../src/domain/errors/invalid-operation.error.js';

describe('Operand', () => {
    it('crea un operando valido y expone su valor', () => {
        const operand = Operand.create(5);
        assert.equal(operand.getValue(), 5);
    });

    it('rechaza valores no finitos', () => {
        assert.throws(() => Operand.create(NaN), InvalidOperationError);
        assert.throws(() => Operand.create(Infinity), InvalidOperationError);
    });

    it('compara operandos por valor', () => {
        const a = Operand.create(3);
        const b = Operand.create(3);
        const c = Operand.create(4);
        assert.equal(a.equals(b), true);
        assert.equal(a.equals(c), false);
    });
});
