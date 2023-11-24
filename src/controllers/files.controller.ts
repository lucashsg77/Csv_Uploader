import { Request, Response } from 'express';
import { parseCsv } from '../utils/csvParser';
import { openDb } from '../utils/database';
import { User } from '../models/user.model';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    if (req.file.mimetype !== 'text/csv') {
      res.status(500).json({ message: 'Invalid file format' }); // 400 Bad Request for client error
      return;
    }

    const records: User[] = await parseCsv(req.file.buffer);
    const db = await openDb();

    // Use parameterized query to avoid SQL injection
    await Promise.all(records.map(record => {
      return db.run(
        'INSERT INTO users (name, city, country, favorite_sport) VALUES (?, ?, ?, ?)',
        [record.name, record.city, record.country, record.favorite_sport]
      );
    }));

    res.status(200).json({ message: 'The file was uploaded successfully.' });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const db = await openDb();
    const query = req.query.q as string;

    // Using parameterized queries for security (preventing SQL Injection)
    const users = await db.all(
      `SELECT * FROM users WHERE 
        name LIKE '%' || ? || '%' OR 
        city LIKE '%' || ? || '%' OR 
        country LIKE '%' || ? || '%' OR 
        favorite_sport LIKE '%' || ? || '%'`,
      [query, query, query, query]
    );

    res.status(200).json({ data: users });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
};
