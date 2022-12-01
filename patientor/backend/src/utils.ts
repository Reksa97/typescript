/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from 'uuid';
import { BaseEntry, Entry, Gender, HealthCheckRating, Patient } from "./types";

export const parseString = (obj: any, key: string): string => {
    if (!obj || !isString(obj)) {
      throw new Error(`Incorrect or missing string ${key}`);
    }
    return obj as string;
};

export const parseHealthCheckRating = (obj: any): HealthCheckRating => {
    if (!obj || !isNumber(obj)) {
      throw new Error('Incorrect or missing healthcheck rating');
    }
    if (!isHealthCheckRating(obj)) {
        throw new Error('Invalid healthcheck rating');
    }
    return obj as HealthCheckRating;
};

export const parseGender = (obj: any): Gender => {
    if (!obj || !isString(obj)) {
      throw new Error('Incorrect or missing gender');
    }
    if (!isGender(obj)) {
        throw new Error('Invalid gender');
    }
    return obj as Gender;
};

export const isHealthCheckRating = (obj: any): boolean => Object.values(HealthCheckRating).includes(obj);
export const isGender = (obj: any): boolean => Object.values<string>(Gender).includes(obj);

export const isString = (obj: any): boolean => {
    return Object.prototype.toString.call(obj) === "[object String]";
};

export const isNumber = (value: any) => typeof value === 'number' && isFinite(value);

export const toNewPatientEntry = (body: any): Patient => ({
    id: uuidv4(),
    name: parseString(body.name, 'name'),
    dateOfBirth: parseString(body.dateOfBirth, 'dateOfBirth'),
    ssn: parseString(body.ssn, 'ssn'),
    gender: parseGender(body.gender),
    occupation: parseString(body.occupation, 'occupation'),
    entries: [],
});

const parseStringArray = (obj: any): string[] => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const isStringArray = obj?.every((i: any) => typeof i === "string");
    if (!isStringArray) throw new Error('Not an array of strings');
    return obj as string[];
};

const parseBaseEntry = (body: any): BaseEntry => {
    return {
        id: uuidv4(),
        description: parseString(body.description, 'description'),
        date: parseString(body.date, 'date'),
        specialist: parseString(body.specialist, 'specialist'),
        diagnosisCodes: parseStringArray(body.diagnosisCodes)
    };
};

export const toNewPatientEntryEntry = (body: any): Entry => {
    const baseEntry = parseBaseEntry(body);
    switch (body.type as Entry['type']) {
        case "HealthCheck":
            return {
                ...baseEntry,
                healthCheckRating: parseHealthCheckRating(body.healthCheckRating),
                type: "HealthCheck"
            };
        case "Hospital":
            return {
                ...baseEntry,
                discharge: {
                    date: parseString(body.discharge.date, 'discharge.date'),
                    criteria: parseString(body.discharge.criteria, 'discharge.criteria')
                },
                type: "Hospital"
            };
        case "OccupationalHealthcare":
            return {
                ...baseEntry,
                employerName: parseString(body.employerName, 'employerName'),
                sickLeave: body.sickLeave ? {
                    startDate: parseString(body.sickLeave.startDate, 'sickLeave.startDate'),
                    endDate: parseString(body.sickLeave.endDate, 'sickLeave.endDate')
                } : undefined,
                type: "OccupationalHealthcare"
            };
        default:
            throw new Error(`Invalid entry type ${body.type as string}`);
    }
};
