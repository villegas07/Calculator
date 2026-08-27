import type { CalculatorStoragePort } from '../../domain/ports/calculator-storage.port.js';
import type { HistoryEntryPrimitives } from '../../domain/entities/history-entry.entity.js';

export class HistoryUseCase {
    constructor(private readonly storage: CalculatorStoragePort) {}

    async list(): Promise<readonly HistoryEntryPrimitives[]> {
        const entries = await this.storage.findAll();
        return entries.map((entry) => entry.toPrimitives());
    }

    async clear(): Promise<void> {
        await this.storage.clear();
    }
}