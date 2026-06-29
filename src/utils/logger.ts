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
      console.log(`[Zebo Commerce SDK] ${message}`, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.enabled) {
      console.error(`[Zebo Commerce SDK] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.enabled) {
      console.warn(`[Zebo Commerce SDK] ${message}`, ...args);
    }
  }
}

