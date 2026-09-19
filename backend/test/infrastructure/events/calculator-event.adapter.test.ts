import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CalculatorEventAdapter } from '../../../src/infrastructure/events/calculator-event.adapter.js';

describe('CalculatorEventAdapter', () => {
    it('notifica a los suscriptores del evento publicado', () => {
        const adapter = new CalculatorEventAdapter();
        const received: unknown[] = [];

        adapter.subscribe('calculation.performed', (payload) => received.push(payload));
        adapter.publish('calculation.performed', { result: 5 });

        assert.deepEqual(received, [{ result: 5 }]);
    });

    it('no notifica a suscriptores de otros eventos', () => {
        const adapter = new CalculatorEventAdapter();
        const received: unknown[] = [];

        adapter.subscribe('otro.evento', (payload) => received.push(payload));
        adapter.publish('calculation.performed', { result: 5 });

        assert.equal(received.length, 0);
    });
});
