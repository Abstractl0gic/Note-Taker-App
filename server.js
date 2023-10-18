const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const dbFilePath = path.join(__dirname, 'db', 'db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuidv4();
        notes.push(newNote);
        fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(notes);
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(dbFilePath, 'utf8', (readErr, data) => {
        if (readErr) {
            console.error(readErr);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let notes;
        try {
            notes = JSON.parse(data);
        } catch (parseErr) {
            console.error(parseErr);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const updatedNotes = notes.filter((note) => note.id !== noteId);

        fs.writeFile(dbFilePath, JSON.stringify(updatedNotes), (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(updatedNotes);
        });
    });
});



// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
