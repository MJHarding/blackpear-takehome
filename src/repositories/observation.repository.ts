import path from 'path';
import { Observation } from '../models/observation.model';
import { loadJsonFiles } from '../utils/file';
import { FHIRSearchParams } from '../models/fhir.model';

const dataDir = path.resolve(__dirname, '../data/observations');

export class ObservationRepository {
  private observations: Observation[];

  constructor() {
    this.observations = loadJsonFiles<Observation>(dataDir);
  }

  async searchObservations(params: FHIRSearchParams): Promise<Observation[]> {
    return this.observations.filter((observation: Observation) => {
      if (params['patient']) {
        const patientId = Array.isArray(params['patient'])
          ? params['patient'][0]
          : params['patient'];

        if (observation.subject.reference !== `Patient/${patientId}`) {
          return false;
        }
      }

      return true;
    });
  }
}
