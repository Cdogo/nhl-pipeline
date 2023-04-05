import pg from 'pg';

const { Pool } = pg

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
});

async function storeData(data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await Promise.all(
      data.map((item) =>
        client.query('INSERT INTO users (name, age, email) VALUES ($1, $2, $3)', [
          item.name,
          item.age,
          item.email,
        ])
      )
    );
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}