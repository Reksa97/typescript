import patientData from '../../data/patients.json';
import { Gender, Patient, PatientPublicData } from '../types';
import { isGender } from '../utils';

const getEntries = () : PatientPublicData[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation }) => {
    const parsedGender = isGender(gender) ? gender as Gender : Gender.Other;
    return {
      id,
      name,
      dateOfBirth,
      gender: parsedGender,
      occupation
    };
  });
};

const addEntry = (patientEntry: Patient): Patient => {
  patientData.push(patientEntry);
  return patientEntry;
};

export default {
  getEntries,
  addEntry
};