import { HistoryEntry } from "../entities/history-entry.entity.js";

export interface CalculatorStoragePort {
    save(entry: HistoryEntry): Promise<void>;
    findAll(): Promise<readonly HistoryEntry[]>;
    clear(): Promise<void>;
}