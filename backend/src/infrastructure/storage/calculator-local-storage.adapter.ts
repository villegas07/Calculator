import { promises as fs } from 'fs';
import * as path from 'path';
import type { CalculatorStoragePort } from '../../domain/ports/calculator-storage.port.js';
import { HistoryEntry } from '../../domain/entities/history-entry.entity.js';
import type { HistoryEntryPrimitives } from '../../domain/entities/history-entry.entity.js';
import { Calculation } from '../../domain/entities/calculation.entity.js';
import { Operand } from '../../domain/value-objects/operand.value-object.js';
import { Operation } from '../../domain/value-objects/operation.value-object.js';
import { Result } from '../../domain/value-objects/result.value-object.js';

const DEFAULT_FILE_PATH = path.resolve(process.cwd(), 'data', 'history.json');


export class CalculatorLocalStorageAdapter implements CalculatorStoragePort {
    private cache: HistoryEntry[] | null = null;

    constructor(private readonly filePath: string = DEFAULT_FILE_PATH) { }

    async save(entry: HistoryEntry): Promise<void> {
        const entries = await this.loadFromDisk();
        entries.push(entry);
        await this.persistToDisk(entries);
    }

    async findAll(): Promise<readonly HistoryEntry[]> {
        return this.loadFromDisk();
    }

    async clear(): Promise<void> {
        await this.persistToDisk([]);
    }

    private async loadFromDisk(): Promise<HistoryEntry[]> {
        if (this.cache) {
            return this.cache;
        }
        this.cache = await this.readEntriesFromFile();
        return this.cache;
    }

    private async readEntriesFromFile(): Promise<HistoryEntry[]> {
        try {
            const raw = await fs.readFile(this.filePath, 'utf-8');
            const parsed: HistoryEntryPrimitives[] = JSON.parse(raw);
            return parsed.map((primitive) => this.toEntity(primitive));
        } catch {
            return [];
        }
    }

    private async persistToDisk(entries: HistoryEntry[]): Promise<void> {
        this.cache = entries;
        await fs.mkdir(path.dirname(this.filePath), { recursive: true });
        const primitives = entries.map((entry) => entry.toPrimitives());
        await fs.writeFile(this.filePath, JSON.stringify(primitives, null, 2), 'utf-8');
    }

    private toEntity(primitive: HistoryEntryPrimitives): HistoryEntry {
        const operation = Operation.fromRawValue(primitive.calculation.operation);
        const operands = primitive.calculation.operands.map((value) => Operand.create(value));
        const result = Result.create(primitive.calculation.result);
        const calculation = Calculation.restore(
            primitive.calculation.id,
            operation,
            operands,
            result,
            new Date(primitive.calculation.performedAt),
        );
        return HistoryEntry.restore(primitive.id, calculation, new Date(primitive.recordedAt));
    }
}