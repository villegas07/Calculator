import { AdditionUseCase } from './use-cases/addition.use-case.js';
import { SubtractionUseCase } from './use-cases/subtraction.use-case.js';
import { MultiplicationUseCase } from './use-cases/multiplication.use-case.js';
import { DivisionUseCase } from './use-cases/division.use-case.js';
import { PowerUseCase } from './use-cases/power.use-case.js';
import { SquareRootUseCase } from './use-cases/square-root.use-case.js';
import { HistoryUseCase } from './use-cases/history.use-case.js';

export interface CalculatorUseCases {
    readonly additionUseCase: AdditionUseCase;
    readonly subtractionUseCase: SubtractionUseCase;
    readonly multiplicationUseCase: MultiplicationUseCase;
    readonly divisionUseCase: DivisionUseCase;
    readonly powerUseCase: PowerUseCase;
    readonly squareRootUseCase: SquareRootUseCase;
    readonly historyUseCase: HistoryUseCase;
}