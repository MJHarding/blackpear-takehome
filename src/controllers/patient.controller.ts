import { Request, Response } from 'express';
import { PatientService } from '../services/patient.service';
import { createFHIRBundle, FHIRSearchParams } from '../models/fhir.model';
import { sanitizeInput, validateNhsNumber } from '../utils/validation';
import { validateFHIRQueryParam, handleFHIRError } from '../utils/fhir-helpers';

export class PatientController {
  private patientService: PatientService;

  constructor(patientService: PatientService) {
    this.patientService = patientService;
  }

  getPatients = async (req: Request, res: Response) => {
    try {
      const searchParams: FHIRSearchParams = {};

      // Validate and sanitize identifier (NHS number)
      if (req.query.identifier !== undefined) {
        const identifierValidation = validateFHIRQueryParam(req.query.identifier, 'Identifier');
        if (!identifierValidation.isValid) {
          return res.status(400).json(identifierValidation.error);
        }

        const sanitizedIdentifier = sanitizeInput(identifierValidation.value);
        searchParams['identifier'] = validateNhsNumber(sanitizedIdentifier);
      }

      if (req.query.family !== undefined) {
        const familyValidation = validateFHIRQueryParam(req.query.family, 'Family');
        if (!familyValidation.isValid) {
          return res.status(400).json(familyValidation.error);
        }

        searchParams['family'] = sanitizeInput(familyValidation.value);
      }

      const patients = await this.patientService.findPatients(searchParams);
      res.json(createFHIRBundle(patients));
    } catch (error) {
      handleFHIRError(res, error);
    }
  };
}
