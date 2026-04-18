export interface ConfigField {
  name: string;
  label: string;
  type: "number" | "text";
  min?: number;
  default: unknown;
}

export interface CipherDefinition {
  id: string;
  label: string;
  description: string;
  configSchema: ConfigField[];
  defaultConfig: Record<string, unknown>;
  configurable: boolean;
  encrypt: (input: string, config: Record<string, unknown>) => string;
  decrypt: (input: string, config: Record<string, unknown>) => string;
}

export interface PipelineNode {
  id: string;
  cipherId: string;
  config: Record<string, unknown>;
}

export interface StepResult {
  nodeId: string;
  input: string;
  output: string;
  error?: string;
}
