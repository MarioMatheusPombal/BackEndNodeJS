const express = require('express');
const db = require('./db');
const cors = require('cors');



const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());
app.use(router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/tasks', (req, res) => {
   const query = 'SELECT * FROM tasks';
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/tasks/:id', (req, res) => {
    const query = 'SELECT * FROM tasks WHERE id = ?';
    db.get(query, [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

app.post('/tasks', (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const query = 'INSERT INTO tasks (name, description, completed) VALUES (?, ?, 0)';
    db.run(query, [name, description], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

app.put('/tasks/:id', (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    let completed = req.body.completed;
    if (typeof completed !== 'number' || completed < 0 || completed > 1) {
        completed = 0;
    }
    const query = 'UPDATE tasks SET name = ?, description = ?, completed = ? WHERE id = ?';
    db.run(query, [name, description, completed, req.params.id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: req.params.id });
    });
});

app.put('/tasks/:id/complete', (req, res) => {
    const query = 'UPDATE tasks SET completed = 1 WHERE id = ?';
    db.run(query, [req.params.id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: req.params.id });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const query = 'DELETE FROM tasks WHERE id = ?';
    db.run(query, [req.params.id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: req.params.id });
    });
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});