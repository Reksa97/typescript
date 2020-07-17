/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Patient } from "./types";

export const parseString = (obj: any): string => {
    if (!obj || !isString(obj)) {
      throw new Error('Incorrect or missing string');
    }
    return obj as string;
};

export const isString = (obj: any): boolean => {
    return Object.prototype.toString.call(obj) === "[object String]";
};

export const toNewPatientEntry = (body: any): Patient => {
    const patientEntry: Patient = {
        id: parseString(body.id),
        name: parseString(body.name),
        dateOfBirth: parseString(body.dateOfBirth),
        ssn: parseString(body.ssn),
        gender: parseString(body.gender),
        occupation: parseString(body.occupation)
    };
    return patientEntry;
};