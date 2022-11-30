import express from 'express';
import cors from 'cors';
import diagnoseService from './services/diagnoseService';
import patientService from './services/patientService';
import { toNewPatientEntry } from './utils';

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3001;

app.get('/api/ping', (_req, res) => { 
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  res.json(diagnoseService.getEntries());
});

app.get('/api/patients', (_req, res) => {
  res.json(patientService.getEntries());
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