export interface Diagnose {
    code: string,
    name: string,
    latin?: string
}

export enum Gender {
    Man = 'male',
    Woman = 'female',
    Other = 'other'
}

export interface Patient {
    id: string;
    name: string;
    occupation: string;
    gender: Gender;
    ssn: string;
    dateOfBirth: string;
}

export type PatientPublicData = Omit<Patient, 'ssn'>;