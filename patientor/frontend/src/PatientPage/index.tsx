import { Box, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { setDiagnoses, setPatient, useStateValue } from "../state";
import { Diagnosis, Patient } from "../types";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";

const PatientPage = () => {
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams();
  const patient = id && patients[id];
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
        {patientEntries.length > 0 ? (
          patientEntries.map((e) => (
            <div key={e.id}>
              <p>
                {e.date} {e.description}
              </p>
              <ul>
                {e.diagnosisCodes?.map((c) => {
                  const diagnosis = diagnoses?.find((d) => d.code === c);
                  return (
                    <li key={c}>
                      {c}{" "}
                      {diagnosis && (
                        <>
                          {diagnosis.name} <i>{diagnosis.latin}</i>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        ) : (
          <p>No entries found for patient</p>
        )}
        <p></p>
      </Box>
    </div>
  );
};

export default PatientPage;
