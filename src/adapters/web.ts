import type { Config, ConfigAdapter } from './types';

export class WebAdapter implements ConfigAdapter {
  async loadConfig(): Promise<Config> {
    const response = await fetch('/config/config.json');
    if (!response.ok) {
      throw new Error('Failed to load config.json');
    }
    return response.json() as Promise<Config>;
  }

  getModelUrl(filename: string): string {
    return `/models/${filename}`;
  }

  getAnimationUrl(filename: string): string {
    return `/models/animations/${filename}`;
  }
}
