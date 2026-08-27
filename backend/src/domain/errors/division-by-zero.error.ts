export class DivisionByZeroError extends Error {
    constructor(){
        super('No es posible dividir entre cero');
        this.name = 'DivisionByZeroError';
        object.setPrototypeOf(this, DivisionByZeroError.prototype);
    }
}