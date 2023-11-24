import { parse, CsvError } from 'csv-parse';
import { User } from '../models/user.model';

export const parseCsv = (buffer: Buffer): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    parse(buffer, {
      columns: true,
      skip_empty_lines: true,
    }, (err: CsvError | undefined, output: any) => {
      if (err) {
        return reject(err);
      }
      resolve(output as User[]);
    });
  });
};
