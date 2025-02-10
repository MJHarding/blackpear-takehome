export interface Identifier {
  system: string;
  value: string;
}

export interface Name {
  family?: string;
  given?: string[];
  use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden';
}

export interface Patient {
  identifier: Identifier[];
  name: Name[];
}
