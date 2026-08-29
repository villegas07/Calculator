import * as readline from 'node:readline';
import type { CalculatorUseCases } from '../../application/calculator-use-cases.js';
import type { CalculationPrimitives } from '../../domain/entities/calculation.entity.js';
import type { HistoryEntryPrimitives } from '../../domain/entities/history-entry.entity.js';
import { toErrorMessage } from '../../shared/error-message.util';

type BinaryExecutor = (a: number, b: number) => Promise<CalculationPrimitives>;
type UnaryExcutor = (a: number) => Promise<CalculationPrimitives>;
type ConsoleCommand = () => Promise<void>;

const MENU = `
========= Calculadora (CLI) =========
1. Sumar
2. Restar
3. Multiplicar
4. Dividir
5. Potencia
6. Raiz cuadrada
7. Ver historial
8. Limpiar historial
0. Salir
======================================
`;

export class CalculatorConsoleAdapter {
    private readonly rl: readline.Interface;
    private readonly commands: ReadonlyMap<string , ConsoleCommand>;
    private running = true;

    constructor(private readonly deps: CalculatorUseCases) {
        this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        this.commands = this.buildCommands();
    }

    async start(): Promise<void> {
        while (this.running) {
            await this.runNextCommand();
        }
        this.rl.close();
        console.log('Hasta luego!');
    }

    private buildCommands(): ReadonlyMap<string, ConsoleCommand> {
        const commands = new Map<string, ConsoleCommand>();
        commands.set('1', () => this.runBinaryOperation((a, b) => this.deps.additionUseCase.execute(a, b)));
        commands.set('2', () => this.runBinaryOperation((a, b) => this.deps.subtractionUseCase.execute(a, b)));
        commands.set('3', () => this.runBinaryOperation((a, b) => this.deps.multiplicationUseCase.execute(a, b)));
        commands.set('4', () => this.runBinaryOperation((a, b) => this.deps.divisionUseCase.execute(a, b)));
        commands.set('5', () => this.runBinaryOperation((a, b) => this.deps.powerUseCase.execute(a, b)));
        commands.set('6', () => this.runUnaryOperation((a) => this.deps.squareRootUseCase.execute(a)));
        commands.set('7', () => this.runHistory());
        commands.set('8', () => this.runClearHistory());
        return commands;
    }

    private async runNextCommand(): Promise<void> {
        const option = (await this.ask('${MENU}\nSeleccione una opcion: ')).trim();
        try {
            await this.executeCommand(option);
        } catch (error) {
            console.error(`\n[Error] ${toErrorMessage(error)}`);
        }
    }

    
}