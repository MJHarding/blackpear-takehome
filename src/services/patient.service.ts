import { Patient } from '../models/patient.model';
import { PatientRepository } from '../repositories/patient.repository';
import { FHIRSearchParams } from '../models/fhir.model';

export class PatientService {
  private patientRepository: PatientRepository;

  constructor(patientRepository: PatientRepository) {
    this.patientRepository = patientRepository;
  }

  async findPatients(searchParams: FHIRSearchParams): Promise<Patient[]> {
    return this.patientRepository.searchPatients(searchParams);
  }
}
