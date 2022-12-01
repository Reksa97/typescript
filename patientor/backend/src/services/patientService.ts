import patientData from '../../data/patients';
import { Entry, Patient, PatientPublicData } from '../types';

const getEntries = () : PatientPublicData[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getEntry = (id: string) : Patient | undefined => patientData.find(p => p.id === id);

const addEntry = (patientEntry: Patient): Patient => {
  patientData.push(patientEntry);
  return patientEntry;
};

const addEntryForPatient = (id: string, entry: Entry): Patient | undefined => {
  const patient = patientData.find(p => p.id === id);
  if (!patient) return;
  patient.entries.push(entry);
  return patient;
};

export default {
  getEntries,
  getEntry,
  addEntry,
  addEntryForPatient
};