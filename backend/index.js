const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Database configuration
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'b5jp95kgcuf2cbvjobok-mysql.services.clever-cloud.com',
  user: 'u1jkxmf7bmdsen5r',
  password: 'wVBATFbynpeBCiqBaFLV',
  database: 'b5jp95kgcuf2cbvjobok',
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// For dashboard table
app.get('/codesnippets', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    connection.query('SELECT * FROM CodeSnippets', (err, results) => {
      connection.release();
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
    });
  });
});

// to add code from editor
app.post('/codesnippets', (req, res) => {
  const { username, preferredCodeLang, sourceCode } = req.body;
  const notes = '';
  const query = 'INSERT INTO CodeSnippets (username, language, timestamp, notes, sourcecode) VALUES (?, ?, NOW(), ?, ?)';
  pool.query(query, [username, preferredCodeLang, notes, sourceCode], (err, results) => {
    if (err) {
      console.error('Error saving data to database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Data saved successfully' });
  });
});

// to run code from dashboard to editor
app.get('/getCode/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT username, language, sourcecode FROM CodeSnippets WHERE id = ?';
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching code snippet from database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json(result);
  });
});

// to updates notes of specific item
app.post('/savenotes/:id', (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const query = 'UPDATE CodeSnippets SET notes = ? WHERE id = ?';
  pool.query(query, [notes, id], (err, result) => {
    if (err) {
      console.error('Error updating notes in database:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.status(200).json({ message: 'Notes saved successfully' });
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
