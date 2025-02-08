export interface FHIRBundle<T> {
  resourceType: 'Bundle';
  type: 'searchset';
  total: number;
  entry: Array<{
    resource: T;
  }>;
  link?: Array<{
    relation: string;
    url: string;
  }>;
}

export interface FHIRSearchParams {
  [key: string]: string | string[] | undefined;
}

export function createFHIRBundle<T>(resources: T[]): FHIRBundle<T> {
  return {
    resourceType: 'Bundle',
    type: 'searchset',
    total: resources.length,
    entry: resources.map((resource) => ({ resource })),
  };
}
