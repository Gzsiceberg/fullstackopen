import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
    res.send('pong');
});

app.get('/bmi', (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);

    if (isNaN(height) || isNaN(weight) || !req.query.height || !req.query.weight) {
        res.status(400).json({ error: "malformatted parameters" });
    } else {
        const bmi = calculateBmi(height, weight);
        res.json({
            weight,
            height,
            bmi
        });
    }
});

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;

    if (!daily_exercises || !target) {
        res.status(400).json({ error: "parameters missing" });
        return;
    }

    if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
        res.status(400).json({ error: "malformatted parameters" });
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (daily_exercises.some((d: any) => isNaN(Number(d)))) {
        res.status(400).json({ error: "malformatted parameters" });
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = calculateExercises(daily_exercises as number[], Number(target));
    res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});