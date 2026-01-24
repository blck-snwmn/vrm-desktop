export interface Config {
  model: string;
  animations: string[];
}

export interface ConfigAdapter {
  loadConfig(): Promise<Config>;
  getModelUrl(filename: string): string;
  getAnimationUrl(filename: string): string;
}
