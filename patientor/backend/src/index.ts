import express from 'express';
import cors from 'cors';
import diagnosisService from './services/diagnosisService';
import patientService from './services/patientService';
import { toNewPatientEntry, toNewPatientEntryEntry } from './utils';

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  res.json(diagnosisService.getEntries());
});

app.get('/api/patients', (_req, res) => {
  res.json(patientService.getEntries());
});

app.get('/api/patients/:id', (req, res) => {
  const patient = patientService.getEntry(req.params.id);
  if (!patient) {
    res.status(404).send('No patient found');
    return;
  }
  res.json(patient);
});

app.post('/api/patients/:id/entries', (req, res) => {
  try {
    const newPatientEntryEntry = toNewPatientEntryEntry(req.body);
    const patient = patientService.addEntryForPatient(req.params.id, newPatientEntryEntry);
    if (!patient) {
      res.status(404).send('No patient found');
      return;
    }
    res.json(patient);
  } catch (e) {
    let message = 'Unknown Error';
    if (e instanceof Error) message = e.message;
    res.status(400).send(message); 
  }
});

app.post('/api/patients', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedEntry = patientService.addEntry(newPatientEntry);
    res.json(addedEntry);
  } catch (e) {
    let message = 'Unknown Error';
    if (e instanceof Error) message = e.message;
    res.status(400).send(message); 
  }
});
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});