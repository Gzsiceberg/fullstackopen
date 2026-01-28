import express from 'express';
import { Request, Response } from 'express';
import patientService from '../services/patientService';
import { newPatientParser } from '../middleware';
import { NewPatientEntry, Patient } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitivePatients());
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
  const addedEntry = patientService.addPatient(req.body);
  res.json(addedEntry);
});

export default router;
