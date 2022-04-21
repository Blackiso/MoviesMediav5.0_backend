export class RequestError extends Error {

    public code:number;

    constructor(message:string, code:number = 500) {
        super(message);
        this.code = code;
    }
    
}