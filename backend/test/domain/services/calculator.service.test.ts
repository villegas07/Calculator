import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CalculatorService } from '../../../src/domain/services/calculator.service.js';
import { Operand } from '../../../src/domain/value-objects/operand.value-object.js';
import { InvalidSquareRootError } from '../../../src/domain/errors/invalid-square-root.error.js';
import { InvalidOperationError } from '../../../src/domain/errors/invalid-operation.error.js';

describe('CalculatorService', () => {
    const service = new CalculatorService();

    it('suma dos operandos', () => {
        assert.equal(service.add(Operand.create(2), Operand.create(3)).getValue(), 5);
    });

    it('resta dos operandos', () => {
        assert.equal(service.subtract(Operand.create(5), Operand.create(3)).getValue(), 2);
    });

    it('multiplica dos operandos', () => {
        assert.equal(service.multiply(Operand.create(4), Operand.create(3)).getValue(), 12);
    });

    it('divide dos operandos', () => {
        assert.equal(service.divide(Operand.create(8), Operand.create(2)).getValue(), 4);
    });

    it('no valida por si mismo el divisor cero (delegado al caso de uso)', () => {
        assert.throws(
            () => service.divide(Operand.create(1), Operand.create(0)),
            InvalidOperationError,
        );
    });

    it('eleva un operando a una potencia', () => {
        assert.equal(service.power(Operand.create(2), Operand.create(3)).getValue(), 8);
    });

    it('calcula la raiz cuadrada de un operando positivo', () => {
        assert.equal(service.squareRoot(Operand.create(9)).getValue(), 3);
    });

    it('rechaza la raiz cuadrada de un numero negativo', () => {
        assert.throws(() => service.squareRoot(Operand.create(-1)), InvalidSquareRootError);
    });
});
