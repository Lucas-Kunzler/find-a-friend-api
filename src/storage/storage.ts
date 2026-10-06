export interface Storage {
  save(file: Buffer, filename: string, contentType: string): Promise<string>;
}
