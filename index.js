const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const pool = new Pool({
  user: 'maad',
  host: 'localhost',
  database: 'cal_tax',
  password: '111497',
  port: 5432, // Default PostgreSQL port
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database at', res.rows[0].now);
  }
});

app.get('/sales-tax', (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is missing' });
  }

  // Perform a database query to retrieve the sales tax for the specified city
  const query = {
    text: 'SELECT column2 FROM caltable WHERE column1 = $1',
    values: [city],
  };

  pool.query(query, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'City not found' });
      } else {
        const salesTax = result.rows[0].column2;
        res.json({ salesTax });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
