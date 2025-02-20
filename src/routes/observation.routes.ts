import express, { Request, Response, NextFunction } from 'express';
import { ObservationController } from '../controllers/observation.controller';
import { ObservationService } from '../services/observation.service';
import { ObservationRepository } from '../repositories/observation.repository';

const router = express.Router();

const observationRepo = new ObservationRepository();
const observationService = new ObservationService(observationRepo);
const observationController = new ObservationController(observationService);

router.get('/v1/observations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await observationController.getObservationsByPatientId(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
