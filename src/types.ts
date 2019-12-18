
export interface IWorkerDefinition {
  id: string;
  entry: string;
  fallback: string | undefined;
}

export interface IFeatureDefinition {
  label: string;
  entry: string | string[] | undefined;
  worker?: IWorkerDefinition;
}
