import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises, ExerciseArguments } from './exerciseCalculator';
import { isArray } from 'util';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const weight = Number(req.query.weight);
    const height = Number(req.query.height);

    if (isNaN(weight) || isNaN(height)) {
        res.status(400).json({ error: 'malformatted parameters' });
        return;
    }

    const bmiData = {
        weight,
        height,
        bmi: calculateBmi(height, weight)
    };
    res.json(bmiData);
});

app.post('/exercises', (req, res) => {
    const { daily_exercises, target } = req.body as ExerciseArguments;

    if (daily_exercises === undefined || target === undefined) {
        res.status(400).json({ error: "parameters missing"});
    }

    if (!isArray(daily_exercises)) res.status(400).json({ error: "malformatted parameters" });

    daily_exercises.forEach(ex => {
        if (isNaN(Number(ex))) res.status(400).json({ error: "malformatted parameters" });
    });

    if (isNaN(Number(target)) || target === null) {
        res.status(400).json({ error: "malformatted parameters" });
    }

    const result = calculateExercises(daily_exercises, Number(target));
    res.json(result);
});

const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});