import { FHIRSearchParams } from '../models/fhir.model';
import { Observation } from '../models/observation.model';
import { ObservationRepository } from '../repositories/observation.repository';

export class ObservationService {
  private observationRepository: ObservationRepository;

  constructor(observationRepository: ObservationRepository) {
    this.observationRepository = observationRepository;
  }

  async findObservationsByPatientId(patientId: FHIRSearchParams): Promise<Observation[]> {
    return this.observationRepository.searchObservations(patientId);
  }
}
