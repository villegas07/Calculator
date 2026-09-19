import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { CalculatorLocalStorageAdapter } from '../../../src/infrastructure/storage/calculator-local-storage.adapter.js';
import { HistoryEntry } from '../../../src/domain/entities/history-entry.entity.js';
import { Calculation } from '../../../src/domain/entities/calculation.entity.js';
import { Operand } from '../../../src/domain/value-objects/operand.value-object.js';
import { Operation, OperationType } from '../../../src/domain/value-objects/operation.value-object.js';
import { Result } from '../../../src/domain/value-objects/result.value-object.js';

let tempDir: string;
let filePath: string;

beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'calculator-storage-test-'));
    filePath = path.join(tempDir, 'history.json');
});

afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
});

function buildEntry(): HistoryEntry {
    const calculation = Calculation.create(
        Operation.create(OperationType.DIVISION),
        [Operand.create(8), Operand.create(2)],
        Result.create(4),
    );
    return HistoryEntry.fromCalculation(calculation);
}

describe('CalculatorLocalStorageAdapter', () => {
    it('devuelve una lista vacia cuando el archivo no existe', async () => {
        const adapter = new CalculatorLocalStorageAdapter(filePath);
        assert.deepEqual(await adapter.findAll(), []);
    });

    it('guarda y recupera entradas, preservando los datos de la calculacion', async () => {
        const adapter = new CalculatorLocalStorageAdapter(filePath);
        await adapter.save(buildEntry());

        const entries = await adapter.findAll();

        assert.equal(entries.length, 1);
        assert.equal(entries[0]?.toPrimitives().calculation.result, 4);
    });

    it('persiste las entradas en disco entre instancias distintas', async () => {
        const first = new CalculatorLocalStorageAdapter(filePath);
        await first.save(buildEntry());

        const second = new CalculatorLocalStorageAdapter(filePath);
        const entries = await second.findAll();

        assert.equal(entries.length, 1);
    });

    it('limpia todas las entradas', async () => {
        const adapter = new CalculatorLocalStorageAdapter(filePath);
        await adapter.save(buildEntry());
        await adapter.clear();

        assert.deepEqual(await adapter.findAll(), []);
    });
});
