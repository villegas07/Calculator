import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InvalidSquareRootError } from '../../../src/domain/errors/invalid-square-root.error.js';

describe('InvalidSquareRootError', () => {
    it('expone el mensaje y el nombre correctos', () => {
        const error = new InvalidSquareRootError();
        assert.equal(error.message, 'No es posible calcular la raíz cuadrada de un número negativo');
        assert.equal(error.name, 'InvalidSquareRootError');
    });

    it('es una instancia de Error y de si misma', () => {
        const error = new InvalidSquareRootError();
        assert.ok(error instanceof Error);
        assert.ok(error instanceof InvalidSquareRootError);
    });
});
