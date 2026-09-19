import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as url from 'node:url';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const mainScript = path.resolve(dirname, '../../../src/main.js');

async function runConsoleSession(inputs: readonly string[]): Promise<string> {
    const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'calculator-console-test-'));
    try {
        return await new Promise((resolve, reject) => {
            const child = spawn('node', [mainScript, 'console'], { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
            let output = '';
            child.stdout.on('data', (chunk) => { output += chunk.toString(); });
            child.stderr.on('data', (chunk) => { output += chunk.toString(); });
            child.on('error', reject);
            child.on('close', () => resolve(output));

            let i = 0;
            const timer = setInterval(() => {
                if (i >= inputs.length) {
                    clearInterval(timer);
                    child.stdin.end();
                    return;
                }
                child.stdin.write(`${inputs[i]}\n`);
                i += 1;
            }, 100);
        });
    } finally {
        await fs.rm(cwd, { recursive: true, force: true });
    }
}

describe('CalculatorConsoleAdapter (integracion via main.ts)', () => {
    it('realiza una suma y muestra el resultado', async () => {
        const output = await runConsoleSession(['1', '5', '3', '0']);
        assert.match(output, /5 \+ 3 = 8/);
        assert.match(output, /Hasta luego!/);
    });

    it('muestra un error controlado al dividir entre cero', async () => {
        const output = await runConsoleSession(['4', '5', '0', '0']);
        assert.match(output, /No es posible dividir entre cero/);
    });

    it('reporta el historial vacio cuando no hay calculos', async () => {
        const output = await runConsoleSession(['7', '0']);
        assert.match(output, /El historial esta vacio/);
    });
});
