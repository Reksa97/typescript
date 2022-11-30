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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entry {
}

export interface Patient {
    id: string;
    name: string;
    occupation: string;
    gender: Gender;
    ssn: string;
    dateOfBirth: string;
    entries: Entry[];
}

export type PatientPublicData = Omit<Patient, 'ssn' | 'entries'>;