import fs from 'fs';
import path from 'path';
import { Patient, Identifier } from '../models/patient.model';
import { FHIRSearchParams } from '../models/fhir.model';
import { ValidationError } from '../utils/validation';

const dataDir = path.resolve(process.cwd(), 'data/patients');

function loadPatientsData(): Patient[] {
  const files = fs.readdirSync(dataDir).filter((file) => file.endsWith('.json'));
  let allPatients: Patient[] = [];

  files.forEach((file) => {
    const filePath = path.join(dataDir, file);
    const rawData = fs.readFileSync(filePath, 'utf8');
    const jsonData: Patient = JSON.parse(rawData);
    allPatients.push(jsonData);
  });

  return allPatients;
}

export class PatientRepository {
  private patients: Patient[];

  constructor() {
    this.patients = loadPatientsData();
  }

  async searchPatients(params: FHIRSearchParams = {}): Promise<Patient[]> {
    // Require at least one search parameter
    if (!params['identifier'] && !params['family']) {
      throw new ValidationError('At least one search parameter (identifier or family) is required');
    }

    return this.patients.filter((patient: Patient) => {
      // NHS Number search
      if (params['identifier']) {
        const nhsId: string | undefined = patient.identifier.find((id: Identifier) =>
          id.system.includes('nhs-number'),
        )?.value;
        const searchNhsNumber = Array.isArray(params['identifier'])
          ? params['identifier'][0]
          : params['identifier'];

        // Exact match required
        if (nhsId !== searchNhsNumber) return false;
      }

      // Surname search
      if (params['family']) {
        const lastName: string | undefined = patient.name?.[0]?.family?.toLowerCase();
        const searchSurname = Array.isArray(params['family'])
          ? params['family'][0]
          : params['family'];

        // Exact match required
        if (lastName !== searchSurname.toLowerCase()) return false;
      }

      return true;
    });
  }
}
