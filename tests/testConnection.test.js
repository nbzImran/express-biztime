// testConnection.js
const db = require('../db');

async function test() {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('Database connected. Current time:', res.rows[0].now);
  } catch (err) {
    console.error('Error testing database connection:', err);
  } finally {
    db.end();
  }
}

test();
