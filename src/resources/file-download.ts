import { writeFile } from 'node:fs/promises';

export class FileDownload {
  constructor(public readonly response: Response) {}

  async arrayBuffer(): Promise<ArrayBuffer> {
    return this.response.arrayBuffer();
  }

  async writeToFile(path: string): Promise<void> {
    const buffer = Buffer.from(await this.arrayBuffer());
    await writeFile(path, buffer);
  }

  async saveTo(path: string): Promise<void> {
    await this.writeToFile(path);
  }
}
