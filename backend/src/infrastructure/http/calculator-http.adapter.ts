import * as http from 'http';
import type { CalculatorUseCases } from '../../application/calculator-use-cases.js'
import type { CalculationPrimitives } from '../../domain/entities/calculation.entity.js';
import { toErrorMessage } from '../../application/shared/error-message.util.js';

type BinaryExecutor = (a: number, b: number) => Promise<CalculationPrimitives>;
type UnaryExecutor = (a: number) => Promise<CalculationPrimitives>;
type RouteHandler = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>;

/**
 * Adaptador HTTP. Expone la calculadora como una API REST usando solo
 * el modulo nativo `http` (sin frameworks), delegando toda la logica a
 * los casos de uso. Este adaptador unicamente enruta, valida el
 * transporte y serializa/deserializa JSON (Single Responsibility).
 *
 * Endpoints:
 *   POST   /calculate/add       { a, b }
 *   POST   /calculate/subtract  { a, b }
 *   POST   /calculate/multiply  { a, b }
 *   POST   /calculate/divide    { a, b }
 *   POST   /calculate/power     { a, b }   -> a ^ b
 *   POST   /calculate/sqrt      { a }
 *   GET    /history
 *   DELETE /history
 */

export class CalculatorHttpAdapter {
    private readonly server: http.Server;
    private readonly routes: ReadonlyMap<string, RouteHandler>;

    constructor(private readonly deps: CalculatorUseCases) {
        this.routes = this.buildRoutes();
        this.server = http.createServer((req, res) => this.dispatch(req, res));
    }

    listen(port: number): void {
        this.server.listen(port, () => {
            console.log(`API de la calculadora escuchando en http://localhost:${port}`);
        });
    }

    close(): void {
        this.server.close();
    }

    private buildRoutes(): ReadonlyMap<string, RouteHandler> {
        const routes = new Map<string, RouteHandler>();
        routes.set('POST /calculate/add', (req, res) =>
            this.handleBinaryOperation(req, res, (a, b) => this.deps.additionUseCase.execute(a, b)));
        routes.set('POST /calculate/subtract', (req, res) =>
            this.handleBinaryOperation(req, res, (a, b) => this.deps.subtractionUseCase.execute(a, b)));
        routes.set('POST /calculate/multiply', (req, res) =>
            this.handleBinaryOperation(req, res, (a, b) => this.deps.multiplicationUseCase.execute(a, b)));
        routes.set('POST /calculate/divide', (req, res) =>
            this.handleBinaryOperation(req, res, (a, b) => this.deps.divisionUseCase.execute(a, b)));
        routes.set('POST /calculate/power', (req, res) =>
            this.handleBinaryOperation(req, res, (a, b) => this.deps.powerUseCase.execute(a, b)));
        routes.set('POST /calculate/sqrt', (req, res) =>
            this.handleUnaryOperation(req, res, (a) => this.deps.squareRootUseCase.execute(a)));
        routes.set('GET /history', (_req, res) => this.handleGetHistory(res));
        routes.set('DELETE /history', (_req, res) => this.handleClearHistory(res));
        return routes;
    }

    private async dispatch(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        res.setHeader('Content-Type', 'application/json');
        const handler = this.routes.get(`${req.method ?? ''} ${req.url ?? ''}`);
        if (!handler) {
            this.sendJson(res, 404, { error: 'Recurso no encontrado.' });
            return;
        }
        await this.runHandler(handler, req, res);
    }

    private async runHandler(
        handler: RouteHandler,
        req: http.IncomingMessage,
        res: http.ServerResponse,
    ): Promise<void> {
        try {
            await handler(req, res);
        } catch (error) {
            this.sendJson(res, 400, { error: toErrorMessage(error) });
        }

    }

    private async handleBinaryOperation(
        req: http.IncomingMessage,
        res: http.ServerResponse,
        execute: BinaryExecutor,
    ): Promise<void> {
        const body = await this.readBody(req);
        const result = await execute(this.parseNumber(body.a, 'a'), this.parseNumber(body.b, 'b'));
        this.sendJson(res, 201, result);
    }

    private async handleUnaryOperation(
        req: http.IncomingMessage,
        res: http.ServerResponse,
        execute: UnaryExecutor,
    ): Promise<void> {
        const body = await this.readBody(req);
        const result = await execute(this.parseNumber(body.a, 'a'));
        this.sendJson(res, 201, result);
    }

    private async handleGetHistory(res: http.ServerResponse): Promise<void> {
        const entries = await this.deps.historyUseCase.list();
        this.sendJson(res, 200, entries);
    }

    private async handleClearHistory(res: http.ServerResponse): Promise<void> {
        await this.deps.historyUseCase.clear();
        this.sendJson(res, 204, null);
    }

    private parseNumber(value: unknown, fieldName: string): number {
        if (typeof value !== 'number' || Number.isNaN(value)) {
            throw new Error(`El campo "${fieldName}" debe ser un numero válido.`);
        }
        return value;
    }

    private async readBody(req: http.IncomingMessage): Promise<Record<string, unknown>> {
        const raw = await this.collectRawBody(req);
        if (raw.length === 0) {
            return {};
        }
        const parsed = JSON.parse(raw);
        if (!this.isRecord(parsed)) {
            throw new Error('El cuerpo de la solicitud debe ser un objeto JSON.');
        }
        return parsed;
    }

    private isRecord(value: unknown): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null;
    }

    private async collectRawBody(req: http.IncomingMessage): Promise<string> {
        return new Promise((resolve, reject) => {
            let raw = '';
            req.on('data', (chunk: Buffer) => {
                raw += chunk.toString();
            });
            req.on('end', () => resolve(raw));
            req.on('error', reject);
        })
    }

    private sendJson(res: http.ServerResponse, statusCode: number, payload: unknown): void {
        res.statusCode = statusCode;
        res.end(payload === null ? undefined : JSON.stringify(payload));
    }
}