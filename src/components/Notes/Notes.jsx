import React, { useEffect, useState } from "react";
import "./Notes.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { format } from "date-fns";
import axiosApi from "../Axios";

const Notes = ({ token, searchQuery }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [formMode, setFormMode] = useState("add"); // "add" or "update"
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Fetch Notes
  useEffect(() => {
    const getNotes = async () => {
      try {
        const res = await axiosApi.get("/notes");
        const notesWithFormattedDate = res.map((note) => {
          const cleanedDate = note.date.replace(".000000Z", "Z");
          const formattedDate = format(new Date(cleanedDate), "MMM d, HH:mm");
          return {
            ...note,
            formattedDate,
          };
        });
        setNotes(notesWithFormattedDate);
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

  // Add or Update Note Submission
  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (formMode === "update") {
      // Update Note
      try {
        const res = await axiosApi.put(`/notes/${editingNoteId}`,
          { title: newNoteTitle, content: newNoteContent }
        );
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === editingNoteId ? { ...res} : note
          )
        );
      } catch (err) {
        console.error("Failed to update note: ", err);
      }
    } else {
      // Add Note
      try {
        const res = await axiosApi.post("/notes",{ title: newNoteTitle, content: newNoteContent });
        setNotes((prevNotes) => [...prevNotes, res]);
      } catch (err) {
        console.error("Failed to add note: ", err);
      }
    }

    setNewNoteTitle("");
    setNewNoteContent("");
    setEditingNoteId(null);
  };

  // Delete Note
  const deleteNote = async (id) => {
    try {
      await axiosApi.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Failed to delete note: ", err);
    }
  };

  // Handle Add Note
  const handleAddNote = () => {
    setFormMode("add");
    setNewNoteTitle("");
    setNewNoteContent("");
    const offcanvasElement = document.getElementById("staticBackdrop");
    const bootstrapOffcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
    bootstrapOffcanvas.show(); // Show the offcanvas
  };

  // Handle Edit Note
  const handleEditNote = (note) => {
    setFormMode("update");
    setEditingNoteId(note.id);
    setNewNoteTitle(note.title);
    setNewNoteContent(note.content);
    const offcanvasElement = document.getElementById("staticBackdrop");
    const bootstrapOffcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
    bootstrapOffcanvas.show(); // Show the offcanvas
  };

  return (
    <div className="list-container">
      {/* Add Note Button */}
      <img
        src="./images/add-alert.png"
        className="add-image"
        type="button"
        onClick={handleAddNote}
      />

      {/* Offcanvas Form */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="staticBackdrop"
        aria-labelledby="staticBackdropLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="staticBackdropLabel">
            {formMode === "add" ? "Add a New Note" : "Update Note"}
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={onFormSubmit}>
            <div className="mb-3">
              <label htmlFor="note-title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="note-title"
                placeholder="Note Title"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="note-content" className="form-label">
                Content
              </label>
              <textarea
                className="form-control"
                id="note-content"
                rows="3"
                placeholder="Note Content"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="form-buttons">
              <button type="submit" className="save-btn btn btn-success">
                {formMode === "add" ? "Save Note" : "Update Note"}
              </button>
              <button
                type="button"
                className="cancel-btn btn btn-secondary"
                onClick={() => setFormMode("")} 
                data-bs-dismiss="offcanvas"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notes List */}
      <div className="notes-list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div className="note-card" key={note.id}>
              <div className="note-header">
                <h2>{note.title}</h2>
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
                    onClick={() => handleEditNote(note)}
                    className="action-icon"
                  />
                </div>
              </div>

              <hr />
              <div className="note-content">
                <p>{note.content}</p>
              </div>
              <p className="note-date">{note.formattedDate}</p>
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
