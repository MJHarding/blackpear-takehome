import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import patientRoutes from './routes/patient.routes';
import observationRoutes from './routes/observation.routes';

dotenv.config();

const app = express();
const port = process.env.DEV_PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Matthews API!');
});

app.use('/api', patientRoutes, observationRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
