# Backend CSV File Processor

This project is a simple backend service that allows for the uploading of CSV files with user data and provides an API for querying this data.

## Features

- Upload CSV files with user data.
- Query user data with partial and case-insensitive matching across all data fields.
- RESTful API implementation using Node.js (without opinionated frameworks).
- Error handling for invalid requests and other server errors.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:

   git clone https://github.com/lucashsg77/Csv_Uploader.git

2. Navigate to the project directory:
   
   cd Csv_Uploader

3. Install dependencies:
   
   npm install

4. To run the application in development mode, execute:
   
   npm run dev

5. To run the tests, execute:
    
   npm run test

## Usage

### Uploading a CSV File

To upload a CSV file, make a POST request to `/api/files` with the CSV file attached under the key "file".

### Querying User Data

To query user data, make a GET request to `/api/users` with a query parameter `?q=` containing your search terms.

## Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - Web application framework
- [SQLite](https://www.sqlite.org/index.html) (optional) - C library that provides a lightweight, disk-based database (if database functionality is implemented)
