import { Response } from 'express';
import { ValidationError } from './validation';

export interface FHIROperationOutcomeIssue {
  severity: 'error' | 'warning' | 'information';
  code: string;
  diagnostics: string;
}

export function createFHIROperationOutcome(
  severity: 'error' | 'warning' | 'information' = 'error',
  code: string = 'invalid',
  diagnostics: string,
): { resourceType: 'OperationOutcome'; issue: FHIROperationOutcomeIssue[] } {
  return {
    resourceType: 'OperationOutcome',
    issue: [
      {
        severity,
        code,
        diagnostics,
      },
    ],
  };
}

export function handleFHIRError(
  res: Response,
  error: unknown,
  defaultMessage: string = 'Internal Server Error',
) {
  if (error instanceof ValidationError) {
    return res.status(400).json(createFHIROperationOutcome('error', 'invalid', error.message));
  }

  console.error('Server error:', error);
  return res.status(500).json(createFHIROperationOutcome('error', 'exception', defaultMessage));
}

export function validateFHIRQueryParam(
  param: unknown,
  paramName: string,
): {
  isValid: boolean;
  value?: string;
  error?: {
    resourceType: 'OperationOutcome';
    issue: FHIROperationOutcomeIssue[];
  };
} {

  if (param === undefined || param === '') {
    return {
      isValid: false,
      error: createFHIROperationOutcome('error', 'invalid', `${paramName} parameter is required`),
    };
  }

  if (typeof param !== 'string') {
    return {
      isValid: false,
      error: createFHIROperationOutcome('error', 'invalid', `${paramName} must be a string`),
    };
  }

  return {
    isValid: true,
    value: param,
  };
}
