import request from 'supertest';
import app from '../src/app';
import fs from 'fs';
import path from 'path';
import { openDb } from '../src/utils/database';

// This function will run before all tests to set up the database
beforeAll(async () => {
  const db = await openDb();
});

describe('Test file upload and retrieval', () => {
  const filePath = path.join(__dirname, 'data/test.csv'); // adjust the path to your test CSV file

  it('should upload a CSV file successfully', async () => {
    const res = await request(app)
      .post('/api/files')
      .attach('file', fs.readFileSync(filePath), 'test.csv')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toBe('The file was uploaded successfully.');
  });

  it('should fail when no file is uploaded', async () => {
    const res = await request(app)
      .post('/api/files')
      .expect('Content-Type', /json/)
      .expect(500);

    expect(res.body.message).toBe('No file uploaded');
  });

  it('should not accept non-CSV files', async () => {
    const res = await request(app)
      .post('/api/files')
      .attach('file', fs.readFileSync(filePath), 'test.txt')
      .expect('Content-Type', /json/)
      .expect(500);

    expect(res.body.message).toBe('Invalid file format');
  });

  it('should retrieve users based on search query', async () => {
    const res = await request(app)
      .get('/api/users?q=John')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'John Doe',
        }),
      ]),
    );
  });

  it('should handle case-insensitive search query', async () => {
    const res = await request(app)
      .get('/api/users?q=JoHn')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'John Doe',
        }),
      ]),
    );
  });

  it('should return an empty array for a search query with no matches', async () => {
    const res = await request(app)
      .get('/api/users?q=NoMatchHere')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.data).toEqual([]);
  });

  it('should prevent SQL injection in search query', async () => {
    // The SQL code here is a benign snippet that, if executed, would attempt to select everything from a non-existent table.
    // An application vulnerable to SQL injection might attempt to execute this code, likely leading to a SQL error due to the non-existent table.
    // A secure application would treat the input as a string literal, leading to a normal empty search result as the input doesn't match any user data.
    const sqlCode = "' OR '1'='1";
    const res = await request(app)
      .get(`/api/users?q=${encodeURIComponent(sqlCode)}`)
      .expect('Content-Type', /json/)
      .expect(200);
  
    // We expect a normal response (no server error) and no user data, as the input shouldn't match any user data.
    expect(res.body.data).toEqual([]);
  });

  it('should handle SQL code in CSV file securely', async () => {
    // Define the directory and file path
    const directory = 'data';
    const filepath = path.join(directory, 'malicious.csv');
  
    // Create a CSV file that includes SQL code as user data.
    const maliciousCsv = 'name,city,country,favorite_sport\n"John\',\'1=1","New York","USA","Basketball"';
  
    // Check if directory exists, if not create it
    if (!fs.existsSync(directory)){
      fs.mkdirSync(directory);
    }
  
    // Write the CSV data to a file
    fs.writeFileSync(filepath, maliciousCsv);
  
    const res = await request(app)
      .post('/api/files')
      .attach('file', fs.readFileSync(filepath), 'malicious.csv')
      .expect('Content-Type', /json/)
      .expect(200);
  
    expect(res.body.message).toBe('The file was uploaded successfully.');
  
    // Clean up the malicious CSV file to avoid future issues
    fs.unlinkSync(filepath);
  });
  // Additional tests go here
});
