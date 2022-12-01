import patientData from '../../data/patients';
import { Patient, PatientPublicData } from '../types';

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

export default {
  getEntries,
  getEntry,
  addEntry
};