import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notes.css";

const Notes = ({ token, UserInfo, searchQuery }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [addNote, setAddNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  // Fetch Notes
  useEffect(() => {
    const getNotes = async () => {
      try {
        const res = await axios.get("https://notes.devlop.tech/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data);
      } catch (err) {
        console.error("Failed to fetch notes: ", err);
      }
    };
    getNotes();
  }, [token]);

  // Filter Notes based on Search Query
  useEffect(() => {
    const filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  // Add Note Button Click
  const onButtonAddClick = (e) => {
    e.preventDefault();
    setAddNote(true);
  };

  // Add New Note Submission
  const onAddNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://notes.devlop.tech/api/notes",
        { title: newNoteTitle, content: newNoteContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prevNotes) => [...prevNotes, res.data]);
      setNewNoteTitle("");
      setNewNoteContent("");
      setAddNote(false);
    } catch (err) {
      console.error("Failed to add note: ", err);
    }
  };

  // Delete Note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`https://notes.devlop.tech/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Failed to delete note: ", err);
    }
  };

  return (
    <div className="list-container">
      {/* Add Note Form */}
      {addNote ? (
        <div className="add-note-form">
          <form onSubmit={onAddNoteSubmit}>
            <h3>Add a New Note</h3>
            <div className="form-group">
              <label htmlFor="note-title">Title:</label>
              <input
                id="note-title"
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Note Title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="note-content">Content:</label>
              <textarea
                id="note-content"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Note Content"
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="save-btn">
                Save Note
              </button>
              <button
                type="button"
                onClick={() => setAddNote(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Add Note Button (visible when addNote is false)
        <button onClick={onButtonAddClick} className="add-note-btn">
          Add Note
        </button>
      )}

      {/* Greeting Section */}
      <div className="greeting">
        <h1>
          Hello, {UserInfo?.userfirstname || "Guest"} 
        </h1>
      </div>

      {/* Notes List */}
      <div className="notes-list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div className="note-card" key={note.id}>
              <div className="note-header">
                <h2>{note.title}</h2>
              </div>
              <div className="note-content">
                <p>{note.content}</p>
              </div>
              <div className="note-actions">
                <img
                  id="trash"
                  src="./images/trash.png"
                  alt="Delete Note"
                  onClick={() => deleteNote(note.id)}
                  className="action-icon"
                />
                <img
                  id="edit"
                  src="./images/pencil.png"
                  alt="Edit Note"
                  className="action-icon"
                />
              </div>
            </div>
          ))
        ) : (
          <p className="no-notes">No notes found. Add or adjust your search!</p>
        )}
      </div>
    </div>
  );
};

export default Notes;
