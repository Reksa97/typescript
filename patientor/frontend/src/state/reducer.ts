import { State } from "./state";
import { Diagnosis, Patient } from "../types";

export type Action =
  {
    type: "SET_DIAGNOSES";
    payload: Diagnosis[];
  }
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "SET_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    };

export const setDiagnoses = (diagnoses: Diagnosis[]): Action =>
  ({ type: "SET_DIAGNOSES", payload: diagnoses });

export const setPatientList = (patients: Patient[]): Action => ({
  type: "SET_PATIENT_LIST",
  payload: patients
});

export const setPatient = (patient: Patient): Action =>
  ({ type: "SET_PATIENT", payload: patient });

export const addPatient = (newPatient: Patient): Action =>
  ({ type: "ADD_PATIENT", payload: newPatient });

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_DIAGNOSES":
      return {
        ...state,
        diagnoses: action.payload
      };
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "SET_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
};
