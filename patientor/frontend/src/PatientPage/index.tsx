import { Box, Button, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cloneDeep } from "lodash";
import { apiBaseUrl } from "../constants";
import { setDiagnoses, setPatient, useStateValue } from "../state";
import {
  Diagnosis,
  Patient,
  Entry,
  HospitalEntry,
  HealthCheckEntry,
  OccupationalHealthcareEntry,
  HealthCheckRating,
  EntryFormValues,
} from "../types";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import MoodIcon from "@mui/icons-material/Mood";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import AddEntryModal from "../AddEntryModal";

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const DiagnosisCodes = ({ codes }: { codes: string[] }) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <ul>
      {codes.map((c) => {
        const diagnosis = diagnoses?.find((d) => d.code === c);
        return (
          <li key={c}>
            <b>{c}</b>
            {diagnosis && (
              <>
                <br />
                {diagnosis.name} <br />
                <i>{diagnosis.latin}</i>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const iconStyle = { paddingLeft: 4, verticalAlign: "middle" };
const detailsStyle = { border: "solid", borderRadius: 4, marginBottom: 8 };
const detailsContentStyle = { paddingLeft: 8 };
const detailsHeaderStyle = { display: "flex", alignItems: "center" };

const HealthCheckDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  return (
    <div style={detailsStyle}>
      <div style={detailsContentStyle}>
        <p style={detailsHeaderStyle}>
          {entry.date} <MonitorHeartIcon style={iconStyle} />
        </p>
        <p>
          <i>{entry.description}</i>
          <br />
          {entry.healthCheckRating === HealthCheckRating.Healthy && (
            <MoodIcon />
          )}
          {entry.healthCheckRating === HealthCheckRating.LowRisk && (
            <SentimentNeutralIcon />
          )}
          {entry.healthCheckRating === HealthCheckRating.HighRisk && (
            <SentimentDissatisfiedIcon />
          )}
          {entry.healthCheckRating === HealthCheckRating.CriticalRisk && (
            <MoodBadIcon />
          )}
        </p>
        {entry.diagnosisCodes && (
          <DiagnosisCodes codes={entry.diagnosisCodes} />
        )}
        <p>Diagnose by {entry.specialist}</p>
      </div>
    </div>
  );
};

const HospitalDetails = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <div style={detailsStyle}>
      <div style={detailsContentStyle}>
        <p style={detailsHeaderStyle}>
          {entry.date} <LocalHospitalIcon style={iconStyle} />
        </p>
        <p>
          <i>{entry.description}</i>
          <br />
          Discharged on {entry.discharge.date}: {entry.discharge.criteria}
        </p>
        <p>Diagnose by {entry.specialist}</p>
        {entry.diagnosisCodes && (
          <DiagnosisCodes codes={entry.diagnosisCodes} />
        )}
      </div>
    </div>
  );
};

const OccupationalHealthcareDetails = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <div style={detailsStyle}>
      <div style={detailsContentStyle}>
        <p style={detailsHeaderStyle}>
          {entry.date} <AssuredWorkloadIcon style={iconStyle} />
        </p>
        <p>
          <i>{entry.description}</i>
          <br />
          {entry.sickLeave &&
            `Sick leave from '${entry.sickLeave.startDate}' to '${entry.sickLeave.endDate}'`}
        </p>
        <p>Diagnose by {entry.specialist}</p>
        {entry.diagnosisCodes && (
          <DiagnosisCodes codes={entry.diagnosisCodes} />
        )}
      </div>
    </div>
  );
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckDetails entry={entry} />;
    case "Hospital":
      return <HospitalDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const PatientPage = () => {
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams();
  const patient = id && patients[id];

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };
  const openModal = (): void => setModalOpen(true);

  const submitNewEntry = async (originalValues: EntryFormValues) => {
    if (!id) return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const values = cloneDeep(originalValues);
    if (values.sickLeave?.startDate === "" || values.sickLeave?.endDate === "")
      values.sickLeave = undefined;
    try {
      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(setPatient(newPatient));
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || "Unrecognized axios error");
        setError(
          String(e?.response?.data?.error) || "Unrecognized axios error"
        );
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchDiagnoses = async () => {
      try {
        const { data: diagnoses } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/diagnoses`
        );
        dispatch(setDiagnoses(diagnoses));
      } catch (error) {
        console.error(error);
      }
    };
    if (!diagnoses) void fetchDiagnoses();

    const fetchPatient = async (id: string) => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setPatient(patient));
      } catch (error) {
        console.error(error);
      }
    };
    if (id && !patients[id]?.ssn) void fetchPatient(id);
  }, [dispatch]);
  if (!patient)
    return (
      <div className="App">
        <Box>
          <Typography align="center" variant="h6">
            No patient found {id}
          </Typography>
        </Box>
      </div>
    );
  const patientEntries = patient.entries ?? [];
  return (
    <div className="App">
      <Box>
        <h1>
          {patient.name}
          {patient.gender === "female" && <FemaleIcon />}
          {patient.gender === "male" && <MaleIcon />}
        </h1>
        <p>
          ssn: {patient.ssn}
          <br />
          occupation: {patient.occupation}
        </p>
        <h2>Entries</h2>
        <div style={{ paddingBottom: 8 }}>
          <Button variant="contained" onClick={() => openModal()}>
            Add New Entry
          </Button>
        </div>

        {patientEntries.length > 0 ? (
          patientEntries.map((e) => <EntryDetails key={e.id} entry={e} />)
        ) : (
          <p>No entries found for patient</p>
        )}
        <p></p>
      </Box>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
    </div>
  );
};

export default PatientPage;
