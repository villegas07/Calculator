import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DivisionByZeroError } from '../../../src/domain/errors/division-by-zero.error.js';

describe('DivisionByZeroError', () => {
    it('expone el mensaje y el nombre correctos', () => {
        const error = new DivisionByZeroError();
        assert.equal(error.message, 'No es posible dividir entre cero');
        assert.equal(error.name, 'DivisionByZeroError');
    });

    it('es una instancia de Error y de si misma', () => {
        const error = new DivisionByZeroError();
        assert.ok(error instanceof Error);
        assert.ok(error instanceof DivisionByZeroError);
    });
});
