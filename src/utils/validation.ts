// Basic Non exhaustive validation functions to act as palceholders for real functionality that I would expect to be part of a mature project.

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Function to check a patients NHS number is 10 digits long (https://www.nhs.uk/nhs-services/online-services/find-nhs-number/#:~:text=Your%20NHS%20number%20is%20a,be%20useful%20to%20have%20it.)
 * @param nhsNumber - A patient NHS number
 * @returns A validated NHS Number
 */
export function validateNhsNumber(nhsNumber?: string): string | undefined {
  if (nhsNumber === undefined) return undefined;

  // Basic NHS Number validation REGEX, 10 digits.
  const nhsNumberRegex = /^\d{10}$/;

  if (!nhsNumberRegex.test(nhsNumber)) {
    throw new ValidationError('Invalid NHS Number format');
  }

  return nhsNumber;
}

/**
 * Function to check if patient ID is a positive integer
 * @param patientId - A patient ID
 * @returns Validated patient ID
 */
export function validatePatientId(patientId: string): string {
  // REGEX test for positive integer
  const positiveIntRegex = /^\d+$/;

  if (positiveIntRegex.test(patientId)) {
    throw new ValidationError('Invalid Patient ID');
  }

  return patientId;
}

/**
 *
 * @param input - an input to have whitespace removed
 * @returns  - A string or undefined
 */
export function sanitizeInput(input: any): string | undefined {
  if (input === null || input === undefined) return undefined;
  const sanitizedInput = String(input).trim();

  return sanitizedInput || undefined;
}
