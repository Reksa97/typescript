import { Box, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiBaseUrl } from "../constants";
import { setPatient, useStateValue } from "../state";
import { Patient } from "../types";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";

const PatientPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams();
  const patient = id && patients[id];
  useEffect(() => {
    if (!id || patients[id]?.ssn) return;
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatient = async () => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setPatient(patient));
      } catch (error) {
        console.error(error);
      }
    };
    void fetchPatient();
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
                {e.diagnosisCodes?.map((c) => (
                  <li key={c}>{c}</li>
                ))}
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
