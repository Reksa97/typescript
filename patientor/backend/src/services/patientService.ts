import patientData from '../../data/patients.json';
import { PatientPublicData } from '../types';

const getEntries = () : PatientPublicData[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation
  }));
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry
};