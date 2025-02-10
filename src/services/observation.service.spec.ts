import { ObservationService } from './observation.service';
import { ObservationRepository } from '../repositories/observation.repository';
import { FHIRSearchParams } from '../models/fhir.model';
import { Observation } from '../models/observation.model';

jest.mock('../repositories/observation.repository');

describe('ObservationService', () => {
  let observationService: ObservationService;
  let mockObservationRepository: jest.Mocked<ObservationRepository>;

  beforeEach(() => {
    mockObservationRepository = {
      searchObservations: jest.fn(),
    } as any;

    observationService = new ObservationService(mockObservationRepository);
  });

  describe('findObservationsByPatientId', () => {
    it('should call repository searchObservations with the provided patient ID', async () => {
      const mockPatientId: FHIRSearchParams = { patient: '1' };
      const mockObservations: Observation[] = [
        {
          resourceType: "Observation",
          status: "final",
          id: "1",
          code: {
            coding: [
              {
                system: "http://read.info/readv2",
                code: "F26..",
                display: "Migraine"
              },
              {
                system: "http://snomed.info/sct",
                code: "37796009",
                display: "Migraine"
              }
            ],
          },
          subject: {
            reference: "Patient/1"
          }
        },
        {
          resourceType: "Observation",
          status: "final",
          id: "2",
          code: {
            coding: [
              {
                system: "http://read.info/readv2",
                code: "F26..",
                display: "Migraine"
              },
              {
                system: "http://snomed.info/sct",
                code: "37796009",
                display: "Migraine"
              }
            ],
          },
          subject: {
            reference: "Patient/1"
          }
        },
      ];

      mockObservationRepository.searchObservations.mockResolvedValue(mockObservations);

      const result = await observationService.findObservationsByPatientId(mockPatientId);

      expect(mockObservationRepository.searchObservations).toHaveBeenCalledWith(mockPatientId);
      expect(result).toEqual(mockObservations);
      expect(result.length).toBe(2);
    });

    it('should handle empty result from repository', async () => {
      const mockPatientId: FHIRSearchParams = { patient: 'nonexistent-patient' };

      mockObservationRepository.searchObservations.mockResolvedValue([]);

      const result = await observationService.findObservationsByPatientId(mockPatientId);

      expect(mockObservationRepository.searchObservations).toHaveBeenCalledWith(mockPatientId);
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle array patient parameter', async () => {
      const mockPatientId: FHIRSearchParams = { patient: ['patient2'] };
      const mockObservations: Observation[] = [
        {
          resourceType: "Observation",
          status: "final",
          id: "3",
          code: {
            coding: [
              {
                system: "http://read.info/readv2",
                code: "F26..",
                display: "Migraine"
              },
              {
                system: "http://snomed.info/sct",
                code: "37796009",
                display: "Migraine"
              }
            ],
          },
          subject: {
            reference: "Patient/2"
          }
        },
      ];

      mockObservationRepository.searchObservations.mockResolvedValue(mockObservations);

      const result = await observationService.findObservationsByPatientId(mockPatientId);

      expect(mockObservationRepository.searchObservations).toHaveBeenCalledWith(mockPatientId);
      expect(result).toEqual(mockObservations);
      expect(result.length).toBe(1);
    });

    it('should handle empty query parameter', async () => {
      const emptyParams: FHIRSearchParams = {};

      mockObservationRepository.searchObservations.mockResolvedValue([]);

      const result = await observationService.findObservationsByPatientId(emptyParams);

      expect(mockObservationRepository.searchObservations).toHaveBeenCalledWith(emptyParams);
      expect(result).toEqual([]);
    });
  });
});
