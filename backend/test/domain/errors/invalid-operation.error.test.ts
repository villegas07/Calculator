import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InvalidOperationError } from '../../../src/domain/errors/invalid-operation.error.js';

describe('InvalidOperationError', () => {
    it('expone el mensaje recibido y el nombre correcto', () => {
        const error = new InvalidOperationError('mensaje de prueba');
        assert.equal(error.message, 'mensaje de prueba');
        assert.equal(error.name, 'InvalidOperationError');
    });

    it('es una instancia de Error y de si misma', () => {
        const error = new InvalidOperationError('otro mensaje');
        assert.ok(error instanceof Error);
        assert.ok(error instanceof InvalidOperationError);
    });
});
