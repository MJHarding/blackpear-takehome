import express, { Request, Response, NextFunction } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { PatientService } from '../services/patient.service';
import { PatientRepository } from '../repositories/patient.repository';

const router = express.Router();

const patientRepo = new PatientRepository();
const patientService = new PatientService(patientRepo);
const patientController = new PatientController(patientService);

router.get('/v1/patients', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await patientController.getPatients(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
