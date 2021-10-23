import { Request, Response } from "express";
import { logger } from "../log";

export class BadRequestError extends Error {
        
    description: string;
    status: number;
    originalError: any;

    constructor(description: string, originalError: any = null, status = 400) {
        super('Bad Request');
        this.description = description;
        this.status = status;
        if(originalError) this.originalError = originalError;
    }
    
}

export class InternalServerError extends Error{

    description: string;
    status: number;
    originalError: any;

    constructor(description: string, originalError: any = null, status = 500) {
        super('Internal Server Error');
        this.description = description;
        this.status = status;
        if(originalError) this.originalError = originalError;
    }
}

export function errorHandler(err: any, req: Request, res: Response, next: any): void {    
    if(err instanceof BadRequestError || err instanceof InternalServerError) {
        if(process.env.NODE_ENV === 'production') {
            delete err.stack
            delete err.originalError
        }
        res.status(err.status || 500).json({message: err.message, description: err.description, status: err.status});
    } else {
        logger.error('unhandeled error',{ error: err });
        res.status(500).send("Sorry, Something happened");
    }
}