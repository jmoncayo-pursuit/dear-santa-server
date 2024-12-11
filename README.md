# Server

## Description
This is the server-side application built with Express.

## Installation
1. Clone the repository.
2. Navigate to the server directory:   ```bash
   cd server   ```
3. Install dependencies:   ```bash
   npm install   ```

## Environment Variables
Create a `.env` file in the server directory with the following content:
plaintext
PORT=3001
PG_USER=your_postgres_user
PG_HOST=localhost
PG_PASSWORD=your_postgres_password
ANTHROPIC_API_KEY=your_anthropic_api_key
## Running the Server
To start the server, run:

## API Endpoints
- **GET /api/letters**: Fetches letters from the database.