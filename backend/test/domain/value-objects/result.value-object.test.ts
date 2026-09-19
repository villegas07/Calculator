import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Result } from '../../../src/domain/value-objects/result.value-object.js';
import { InvalidOperationError } from '../../../src/domain/errors/invalid-operation.error.js';

describe('Result', () => {
    it('crea un resultado valido y expone su valor', () => {
        const result = Result.create(8);
        assert.equal(result.getValue(), 8);
    });

    it('rechaza valores no finitos', () => {
        assert.throws(() => Result.create(NaN), InvalidOperationError);
        assert.throws(() => Result.create(Infinity), InvalidOperationError);
    });
});
