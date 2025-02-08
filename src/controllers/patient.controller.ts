import { Request, Response } from 'express';
import { PatientService } from '../services/patient.service';
import { createFHIRBundle } from '../models/fhir.model';
import { validateNhsNumber, sanitizeInput, ValidationError } from '../utils/validation';

export class PatientController {
  private patientService: PatientService;

  constructor(patientService: PatientService) {
    this.patientService = patientService;
  }

  getPatients = async (req: Request, res: Response) => {
    try {
      // Sanitize and validate inputs
      const searchParams: any = {};

      if (req.query.identifier !== undefined) {
        if (typeof req.query.identifier !== 'string') {
          return res.status(400).json({
            resourceType: 'OperationOutcome',
            issue: [
              {
                severity: 'error',
                code: 'invalid',
                diagnostics: 'Identifier must be a string',
              },
            ],
          });
        }
        const nhsNumberStr = sanitizeInput(req.query.identifier);
        searchParams['identifier'] = validateNhsNumber(nhsNumberStr);
      }

      if (req.query.family !== undefined) {
        if (typeof req.query.family !== 'string') {
          return res.status(400).json({
            resourceType: 'OperationOutcome',
            issue: [
              {
                severity: 'error',
                code: 'invalid',
                diagnostics: 'Family name must be a string',
              },
            ],
          });
        }
        searchParams['family'] = sanitizeInput(req.query.family);
      }

      // Perform query with validated inputs
      const patients = await this.patientService.findPatients(searchParams);

      // Return FHIR bundle
      res.json(createFHIRBundle(patients));
    } catch (error) {
      // Differentiate between validation and server errors
      if (error instanceof ValidationError) {
        return res.status(400).json({
          resourceType: 'OperationOutcome',
          issue: [
            {
              severity: 'error',
              code: 'invalid',
              diagnostics: error.message,
            },
          ],
        });
      }

      console.error('Patient search error:', error);
      res.status(500).json({
        resourceType: 'OperationOutcome',
        issue: [
          {
            severity: 'error',
            code: 'exception',
            diagnostics: 'Internal Server Error',
          },
        ],
      });
    }
  };
}
