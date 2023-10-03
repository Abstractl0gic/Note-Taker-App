const notesList = document.getElementById('notes-list');
const noteTitleInput = document.getElementById('note-title');
const noteTextInput = document.getElementById('note-text');

// Function to fetch and display notes
async function fetchNotes() {
    const response = await fetch('/api/notes');
    const notes = await response.json();
    notesList.innerHTML = '';
    notes.forEach((note) => {
        const noteItem = document.createElement('div');
        noteItem.innerText = note.title;
        noteItem.addEventListener('click', () => displayNoteDetails(note));
        notesList.appendChild(noteItem);
    });
}

// Function to save a new note
async function saveNote() {
    const title = noteTitleInput.value;
    const text = noteTextInput.value;
    if (title && text) {
        const response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, text }),
        });
        const newNote = await response.json();
        displayNoteDetails(newNote);
        fetchNotes(); // Refresh notes list
        noteTitleInput.value = '';
        noteTextInput.value = '';
    } else {
        alert('Please enter both title and text for the note.');
    }
}

// Function to display note details
function displayNoteDetails(note) {
    noteTitleInput.value = note.title;
    noteTextInput.value = note.text;
}
