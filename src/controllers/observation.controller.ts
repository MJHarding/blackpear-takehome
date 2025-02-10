import { Request, Response } from 'express';
import { ObservationService } from '../services/observation.service';
import { createFHIRBundle } from '../models/fhir.model';
import { sanitizeInput } from '../utils/validation';
import {
  handleFHIRError,
  validateFHIRQueryParam,
  createFHIROperationOutcome,
} from '../utils/fhir-helpers';

export class ObservationController {
  private observationService: ObservationService;

  constructor(observationService: ObservationService) {
    this.observationService = observationService;
  }

  getObservationsByPatientId = async (req: Request, res: Response) => {

    if (!req.query || Object.keys(req.query).length === 0) {
      return res
        .status(400)
        .json(createFHIROperationOutcome('error', 'invalid', 'No query parameters provided'));
    }

    try {
      const patient = validateFHIRQueryParam(req.query.patient, 'Patient');
      if (!patient.isValid) {
        return res.status(400).json(patient.error);
      }

      // Use helmet or some some core service validation function in production
      const sanitizedPatientId = sanitizeInput(patient.value);
      const observations = await this.observationService.findObservationsByPatientId({
        patient: sanitizedPatientId,
      });

      res.json(createFHIRBundle(observations));
    } catch (error) {
      handleFHIRError(res, error);
    }
  };
}
