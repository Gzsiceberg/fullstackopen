import patients from '../data/patients';
import { NonSensitivePatient, NewPatientEntry, Patient, NewEntry, Entry } from '../types';
import { v1 as uuid } from 'uuid';

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
    entries: []
  };

  patients.push(newPatient);
  return newPatient;
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addEntry = (patientId: string, entry: NewEntry): Entry => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        throw new Error('Patient not found');
    }
    const newEntry = {
        id: uuid(),
        ...entry
    } as Entry;
    patient.entries.push(newEntry);
    return newEntry;
};

export default {
  getNonSensitivePatients,
  addPatient,
  getPatient,
  addEntry
};
