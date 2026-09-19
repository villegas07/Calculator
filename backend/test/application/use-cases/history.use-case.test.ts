import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { HistoryUseCase } from '../../../src/application/use-cases/history.use-case.js';
import { HistoryEntry } from '../../../src/domain/entities/history-entry.entity.js';
import { Calculation } from '../../../src/domain/entities/calculation.entity.js';
import { Operand } from '../../../src/domain/value-objects/operand.value-object.js';
import { Operation, OperationType } from '../../../src/domain/value-objects/operation.value-object.js';
import { Result } from '../../../src/domain/value-objects/result.value-object.js';
import { InMemoryStorage } from './test-doubles.js';

describe('HistoryUseCase', () => {
    it('lista las entradas guardadas como primitivas', async () => {
        const storage = new InMemoryStorage();
        const calculation = Calculation.create(
            Operation.create(OperationType.ADDITION),
            [Operand.create(1), Operand.create(1)],
            Result.create(2),
        );
        await storage.save(HistoryEntry.fromCalculation(calculation));

        const useCase = new HistoryUseCase(storage);
        const entries = await useCase.list();

        assert.equal(entries.length, 1);
        assert.equal(entries[0]?.calculation.result, 2);
    });

    it('limpia el historial delegando en el storage', async () => {
        const storage = new InMemoryStorage();
        const calculation = Calculation.create(
            Operation.create(OperationType.ADDITION),
            [Operand.create(1), Operand.create(1)],
            Result.create(2),
        );
        await storage.save(HistoryEntry.fromCalculation(calculation));

        const useCase = new HistoryUseCase(storage);
        await useCase.clear();

        assert.equal((await storage.findAll()).length, 0);
    });
});
