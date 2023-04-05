# Game Data Polling and Insertion

This application polls an API for game data and inserts it into a PostgreSQL database at a set interval. The scheduled time for each game is determined by retrieving the game schedule data from the NHL API.

## Dependencies
- node-schedule
- pg

## Configuration

This application requires a `.env` file with the following properties:

- `API_ENDPOINT`: The NHL API endpoint to use.
- `DB_HOST`: The hostname of the PostgreSQL database.
- `DB_PORT`: The port number to use for the PostgreSQL database.
- `DB_NAME`: The name of the PostgreSQL database.
- `DB_USER`: The username to use for the PostgreSQL database.
- `DB_PASSWORD`: The password to use for the PostgreSQL database.

Example .env file:

```
API_ENDPOINT=https://statsapi.web.nhl.com
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=mypassword
```

## Usage

1. Install the required dependencies:


2. Set up the PostgreSQL database and create a new table to store the game data. Example SQL query:

```sql
CREATE TABLE game_data (
  id SERIAL PRIMARY KEY,
  home_team VARCHAR(50) NOT NULL,
  away_team VARCHAR(50) NOT NULL,
  date TIMESTAMP NOT NULL,
  data JSONB NOT NULL
);
```

3. Create a .env file with the necessary configuration parameters.

4. Start the application:

```
npm start
```

This will fetch the game schedule data from the NHL API and schedule each game for polling at the appropriate time.

The application will continue running indefinitely, polling for game data at the set interval and inserting it into the database.

To stop the application, press Ctrl+C.