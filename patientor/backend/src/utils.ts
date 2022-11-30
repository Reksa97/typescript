/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from 'uuid';
import { Gender, Patient } from "./types";

export const parseString = (obj: any, key: string): string => {
    if (!obj || !isString(obj)) {
      throw new Error(`Incorrect or missing string ${key}`);
    }
    return obj as string;
};

export const parseGender = (obj: any): Gender => {
    if (!obj || !isString(obj)) {
      throw new Error('Incorrect or missing gender');
    }
    if (!isGender(obj)) {
        throw new Error(`Invalid gender ${obj as string}`);
    }
    return obj as Gender;
};

export const isGender = (obj: any): boolean => Object.values<string>(Gender).includes(obj);

export const isString = (obj: any): boolean => {
    return Object.prototype.toString.call(obj) === "[object String]";
};

export const toNewPatientEntry = (body: any): Patient => ({
    id: uuidv4(),
    name: parseString(body.name, 'name'),
    dateOfBirth: parseString(body.dateOfBirth, 'dateOfBirth'),
    ssn: parseString(body.ssn, 'ssn'),
    gender: parseGender(body.gender),
    occupation: parseString(body.occupation, 'occupation')
});