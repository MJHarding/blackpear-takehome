export interface FHIRSearchParams {
  [key: string]: string | string[] | number | undefined;
}

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

export function createFHIRBundle<T>(resources: T[]): FHIRBundle<T> {
  const bundle: FHIRBundle<T> = {
    resourceType: 'Bundle',
    type: 'searchset',
    total: resources.length,
    entry: resources.map((resource) => ({ resource })),
  };
  return bundle;
}
