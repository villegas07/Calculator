import { CalculatorService } from './domain/services/calculator.service.js';
import { CalculatorLocalStorageAdapter } from './infrastructure/storage/calculator-local-storage.adapter.js';
import { CalculatorEventAdapter } from './infrastructure/events/calculator-event.adapter.js';
import { CalculationRecorder } from './application/shared/calculation-recorder.js';
import type { CalculatorUseCases } from './application/calculator-use-cases.js';
import { AdditionUseCase } from './application/use-cases/addition.use-case.js';
import { SubtractionUseCase } from './application/use-cases/subtraction.use-case.js';
import { MultiplicationUseCase } from './application/use-cases/multiplication.use-case.js';
import { DivisionUseCase } from './application/use-cases/division.use-case.js';
import { PowerUseCase } from './application/use-cases/power.use-case.js';
import { SquareRootUseCase } from './application/use-cases/square-root.use-case.js';
import { HistoryUseCase } from './application/use-cases/history.use-case.js';
import { CalculatorConsoleAdapter } from './infrastructure/console/calculator-console.adapter.js';
import { CalculatorHttpAdapter } from './infrastructure/http/calculator-http.adapter.js';

const CALCULATION_PERFORMED_EVENT = 'calculation.performed';
const DEFAULT_HTTP_PORT = 3000;

function bootstrap(): void {
    const eventPublisher = new CalculatorEventAdapter();
    subscribeToEvents(eventPublisher);

    const useCases = buildUseCases(eventPublisher);
    runSelectedAdapters(useCases);
}

function subscribeToEvents(eventPublisher: CalculatorEventAdapter): void {
    eventPublisher.subscribe(CALCULATION_PERFORMED_EVENT, (payload) => {
        console.log('[evento]', CALCULATION_PERFORMED_EVENT, payload);
    });
}

function buildUseCases(eventPublisher: CalculatorEventAdapter): CalculatorUseCases {
    const calculatorService = new CalculatorService();
    const storage = new CalculatorLocalStorageAdapter();
    const recorder = new CalculationRecorder(storage, eventPublisher);

    return {
        additionUseCase: new AdditionUseCase(calculatorService, recorder),
        subtractionUseCase: new SubtractionUseCase(calculatorService, recorder),
        multiplicationUseCase: new MultiplicationUseCase(calculatorService, recorder),
        divisionUseCase: new DivisionUseCase(calculatorService, recorder),
        powerUseCase: new PowerUseCase(calculatorService, recorder),
        squareRootUseCase: new SquareRootUseCase(calculatorService, recorder),
        historyUseCase: new HistoryUseCase(storage),
    };
}

function runSelectedAdapters(useCases: CalculatorUseCases): void {
    const mode = process.argv[2] ?? 'console';
    if (mode === 'http') {
        const port = Number(process.argv[3] ?? DEFAULT_HTTP_PORT);
        new CalculatorHttpAdapter(useCases).listen(port);
        return;
    }
    void new CalculatorConsoleAdapter(useCases).start();
}

bootstrap();