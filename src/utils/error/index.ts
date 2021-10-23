import { Request, Response } from "express";
import { logger } from "../log";

export class BadRequestError extends Error {
        
    description: string;
    status: number;

    constructor(description: string, status = 400) {
        super('Bad Request');
        this.description = description;
        this.status = status;
    }
    
}

export class InternalServerError extends Error{

    description: string;
    status: number;

    constructor(description: string, status = 500) {
        super('Internal Server Error');
        this.description = description;
        this.status = status;
    }
}

export function errorHandler(err: any, req: Request, res: Response): void {
    if(err instanceof BadRequestError || err instanceof InternalServerError) {
        if(process.env.NODE_ENV === 'production') {
            delete err.stack
        }
        res.status(err.status).json(err);
    } else {
        logger.error('unhandeled error',{ error: err });
        res.status(500).send("Sorry, Something happened");
    }
}