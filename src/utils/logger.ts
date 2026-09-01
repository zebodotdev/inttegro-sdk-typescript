/**
 * Simple logger utility for debug mode
 */

export class Logger {
  private enabled: boolean;

  constructor(enabled = false) {
    this.enabled = enabled;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.enabled) {
      console.log(`[Inttegro SDK] ${message}`, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.enabled) {
      console.error(`[Inttegro SDK] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.enabled) {
      console.warn(`[Inttegro SDK] ${message}`, ...args);
    }
  }
}
