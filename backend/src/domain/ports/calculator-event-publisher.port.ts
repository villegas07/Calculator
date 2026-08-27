export type CalculatorEventHandler = (payload: unknown) => void;

export interface CalculatorEventPublisherPort {
    publish(eventName: string, payload: unknown): void;
    subscribe(eventName: string, handler: CalculatorEventHandler): void;
}