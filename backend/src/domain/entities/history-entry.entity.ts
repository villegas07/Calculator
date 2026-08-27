import { randomUUID } from 'crypto';
import type { Calculation, CalculationPrimitives } from './calculation.entity.js';

export interface HistoryEntryPrimitives {
    readonly id: string;
    readonly calculation: CalculationPrimitives;
    readonly createdAt: string;
}

export class HistoryEntry {
    private constructor(
        private readonly id: string,
        private readonly calculation: Calculation,
        private readonly recordedAt: Date,
    ) {}

    static fromCalculation(calculation: Calculation): HistoryEntry {
        return new HistoryEntry(randomUUID(), calculation, new Date());
    }

    static restore(id: string, calculation: Calculation, recordedAt: Date): HistoryEntry {
        return new HistoryEntry(id, calculation, recordedAt);
    }

    toPrimitives(): HistoryEntryPrimitives {
        return {
            id: this.id,
            calculation: this.calculation.toPrimitives(),
            createdAt: this.recordedAt.toISOString(),
        };
    }
}