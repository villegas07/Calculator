export class InvalidSquareRootError extends Error {
    constructor(){
        super('No es posible calcular la raíz cuadrada de un número negativo');
        this.name = 'InvalidSquareRootError';
        Object.setPrototypeOf(this, InvalidSquareRootError.prototype);
    }
}