export interface FactData {
  fact: string;
}

export interface FormInput {
  firstname: string;
}

export interface AgeData {
  age: string;
}

export interface LoaderProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface Api {
  signal?: AbortSignal;
  name?: string;
  url: string;
}
