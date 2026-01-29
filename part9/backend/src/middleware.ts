import { Request, Response, NextFunction } from 'express';
import { NewPatientSchema } from './types';
import { NewEntrySchema, parseDiagnosisCodes } from './utils';
import { z } from 'zod';

export const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        // Use parseDiagnosisCodes to safely extract and validate diagnosis codes
        const diagnosisCodes = parseDiagnosisCodes(req.body);
        
        // Create a copy of the body with parsed diagnosis codes
        const entryData = {
            ...req.body,
            diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined
        };
        
        NewEntrySchema.parse(entryData);
        
        // Update req.body with the parsed data
        req.body = entryData;
        next();
    } catch (error: unknown) {
        next(error);
    }
};

export const errorHandler = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};
