import patientData from '../../data/patients.json';
import { Gender, Patient, PatientPublicData } from '../types';

const patients: Patient[] = patientData.map(p => ({...p, gender: p.gender as Gender}));

const getEntries = () : PatientPublicData[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getEntry = (id: string) : Patient | undefined => patients.find(p => p.id === id);

const addEntry = (patientEntry: Patient): Patient => {
  patients.push(patientEntry);
  return patientEntry;
};

export default {
  getEntries,
  getEntry,
  addEntry
};