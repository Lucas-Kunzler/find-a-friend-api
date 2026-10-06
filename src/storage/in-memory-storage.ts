import type { Storage } from "./storage.js";

export class InMemoryStorage implements Storage {
  public files: {
    filename: string;
    buffer: Buffer;
    contentType: string;
    url: string;
  }[] = [];

  async save(
    file: Buffer,
    filename: string,
    contentType: string,
  ): Promise<string> {
    const url = `http://storage.test/${filename}`;

    this.files.push({
      filename,
      buffer: file,
      contentType,
      url,
    });

    return url;
  }
}
