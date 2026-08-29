import {EventEmitter} from 'node:events';
import type { CalculatorEventHandler,CalculatorEventPublisherPort } from '../../domain/ports/calculator-event-publisher.port.js';

export class CalculatorEventAdapter implements CalculatorEventPublisherPort {
    private readonly emittir = new EventEmitter();

    publish(eventName: string, payload: unknown): void {
        this.emittir.emit(eventName, payload);
    }

    subscribe(eventName: string, handler: CalculatorEventHandler): void {
        this.emittir.on(eventName, handler);
    }
}