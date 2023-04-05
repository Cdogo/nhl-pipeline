// Import the pg module
import pg from 'pg';

// Destructure the Pool object from the pg module
const { Pool } = pg;

// Retrieve the necessary environment variables
const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

// Create a new pool object to connect to the PostgreSQL database
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
});

/**
 * Creates a new table in the database with three columns: "id" (a serial primary key), 
 * "gameData", "homeTeam", and "awayTeam", all of which are of type JSONB.
 * @returns {Promise} Resolves with a result object if table creation was successful.
 */
export async function createTable() {
  // Get a client from the pool
  const client = await pool.connect();

  // SQL query to create the "games" table
  const createTableQuery = `
    CREATE TABLE games (
      id SERIAL PRIMARY KEY,
      gameData JSONB,
      homeTeam JSONB,
      awayTeam JSONB
    );
  `;

  try {
    // Execute the create table query using the client object
    const result = await client.query(createTableQuery);

    // Log a success message to the console
    console.log(`[${new Date()}] Created games table`);

    // Return the result object
    return result;
  } catch (err) {
    // Log the error message to the console
    console.error(err);
  } finally {
    // Release the client back to the pool
    client.release();
  }
}

/**
 * Inserts data into the "games" table.
 * @param {Object} gameData - Data for the game.
 * @param {Object} homeTeam - Data for the home team.
 * @param {Object} awayTeam - Data for the away team.
 * @returns {Promise} Resolves with the first row of the result set if the insertion was successful.
 */
export async function insertData(gameData, homeTeam, awayTeam) {
  // Get a client from the pool
  const client = await pool.connect();

  try {
    // Begin a transaction
    await client.query('BEGIN');

    // SQL query to insert data into the "games" table
    const insertQuery = `
      INSERT INTO games (gameData, homeTeam, awayTeam)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    // Values to be inserted into the table
    const values = [gameData, homeTeam, awayTeam];

    // Execute the insert query using the client object
    const result = await client.query(insertQuery, values);

    // Commit the transaction
    await client.query('COMMIT');

    // Log a success message to the console
    console.log(`[${new Date()}] Inserted data into games table`);

    // Return the first row of the result set
    return result.rows[0];
  } catch (err) {
    // Rollback the transaction
    await client.query('ROLLBACK');

    // Log the error message to the console
    console.error(err);

    // Rethrow the error
    throw err;
  } finally {
    // Release the client back to the pool
    client.release();
  }
}
