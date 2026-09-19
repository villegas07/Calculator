import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { toErrorMessage } from '../../../src/application/shared/error-message.util.js';

describe('toErrorMessage', () => {
    it('devuelve el mensaje cuando recibe un Error', () => {
        assert.equal(toErrorMessage(new Error('algo fallo')), 'algo fallo');
    });

    it('convierte a texto cualquier valor que no sea un Error', () => {
        assert.equal(toErrorMessage('texto plano'), 'texto plano');
        assert.equal(toErrorMessage(404), '404');
        assert.equal(toErrorMessage(null), 'null');
    });
});
