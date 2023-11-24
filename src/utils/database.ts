import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export const openDb = async (): Promise<Database> => {
  if (!db) {
    db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database,
    });
    await db.run('CREATE TABLE IF NOT EXISTS users (name TEXT, city TEXT, country TEXT, favorite_sport TEXT)');
  }
  return db;
};