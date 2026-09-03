import { writeFile } from 'node:fs/promises';

export class FileDownload {
  constructor(private readonly readBody: () => Promise<ArrayBuffer>) {}

  async arrayBuffer(): Promise<ArrayBuffer> {
    return this.readBody();
  }

  async writeToFile(path: string): Promise<void> {
    const buffer = Buffer.from(await this.arrayBuffer());
    await writeFile(path, buffer);
  }

  async saveTo(path: string): Promise<void> {
    await this.writeToFile(path);
  }
}
