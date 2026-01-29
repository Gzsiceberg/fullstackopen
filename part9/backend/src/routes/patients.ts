import express from 'express';
import { Request, Response } from 'express';
import patientService from '../services/patientService';
import { newPatientParser, newEntryParser } from '../middleware';
import { NewPatientEntry, Patient, NewEntry, Entry } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatient(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send('Patient not found');
  }
});

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
  const addedEntry = patientService.addPatient(req.body);
  res.json(addedEntry);
});

router.post('/:id/entries', newEntryParser, (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
  const addedEntry = patientService.addEntry(req.params.id, req.body);
  res.json(addedEntry);
});

export default router;
