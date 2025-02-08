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
    // Early return if query is undefined
    if (req.query === undefined) {
      return res
        .status(400)
        .json(createFHIROperationOutcome('error', 'invalid', 'No query parameters provided'));
    }

    // Early return if patient parameter is undefined
    if (req.query.patient === undefined) {
      return res
        .status(400)
        .json(createFHIROperationOutcome('error', 'invalid', 'Patient parameter is required'));
    }

    try {
      // Validate patient parameter type
      const patientValidation = validateFHIRQueryParam(req.query.patient, 'Patient');
      if (!patientValidation.isValid) {
        return res.status(400).json(patientValidation.error);
      }

      // Sanitize patient ID
      const patientId = patientValidation.value;
      const sanitizedPatientId = sanitizeInput(patientId);

      // Validate sanitized patient ID
      if (!sanitizedPatientId) {
        return res
          .status(400)
          .json(
            createFHIROperationOutcome('error', 'invalid', 'Invalid patient ID after sanitization'),
          );
      }

      // Perform query with validated patient ID
      const observations =
        await this.observationService.findObservationsByPatientId(sanitizedPatientId);

      // Return FHIR bundle
      res.json(createFHIRBundle(observations));
    } catch (error) {
      handleFHIRError(res, error);
    }
  };
}
