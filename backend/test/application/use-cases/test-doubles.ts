import type { HistoryEntry } from '../../../src/domain/entities/history-entry.entity.js';
import type { CalculatorStoragePort } from '../../../src/domain/ports/calculator-storage.port.js';
import type {
    CalculatorEventHandler,
    CalculatorEventPublisherPort,
} from '../../../src/domain/ports/calculator-event-publisher.port.js';

export class InMemoryStorage implements CalculatorStoragePort {
    private entries: HistoryEntry[] = [];

    async save(entry: HistoryEntry): Promise<void> {
        this.entries.push(entry);
    }

    async findAll(): Promise<readonly HistoryEntry[]> {
        return this.entries;
    }

    async clear(): Promise<void> {
        this.entries = [];
    }
}

export class NoopEventPublisher implements CalculatorEventPublisherPort {
    publish(_eventName: string, _payload: unknown): void {}

    subscribe(_eventName: string, _handler: CalculatorEventHandler): void {}
}
