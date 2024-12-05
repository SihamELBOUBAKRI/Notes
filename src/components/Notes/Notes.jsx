import React, { useEffect, useState } from "react";
import "./Notes.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { format } from "date-fns";
import axiosApi from "../Axios";
import Select from 'react-select';

const Notes = ({ token, searchQuery , setLoading}) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [formMode, setFormMode] = useState("add"); // "add" or "update"
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // State for selected users

// Fetch users when the component is mounted
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axiosApi.get("/users");
      const userOptions = res.map((user) => ({
        value: user.id, // Map `id` to `value`
        label: `${user.first_name} ${user.last_name}`, // User name
      }));
      setUsers(userOptions);
    } catch (err) {
      console.error("Failed to fetch users: ", err);
    }
  };

  fetchUsers();
}, []);


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
        console.log(notes)
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
    setLoading(true);
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
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      // Add Note
      setLoading(true);
      try {
        const res = await axiosApi.post("/notes",{ title: newNoteTitle, content: newNoteContent ,shared_with: selectedUsers.map((user) => user.value)});
        setNotes((prevNotes) => [ res,...prevNotes]);
      } catch (err) {
        console.error("Failed to add note: ", err);
      }finally {
        setLoading(false); // Stop loading
      }
    }

    setNewNoteTitle("");
    setNewNoteContent("");
    setEditingNoteId(null);
    setSelectedUsers([]);
  };

  // Delete Note
  const deleteNote = async (id) => {
    setLoading(true);
    try {
      await axiosApi.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
      setLoading(false);
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

  const getUserInitial = (user) => user.first_name.charAt(0).toUpperCase();
  const getFullName = (user) => `${user.first_name} ${user.last_name}`;

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

            {formMode === "add" && (<div className="mb-3">
              <label htmlFor="note-shared-with" className="form-label">
                Share With
              </label>
              <Select
                id="note-shared-with"
                options={users} // Options are the fetched users
                value={selectedUsers} // Selected users
                onChange={(selectedOptions) => setSelectedUsers(selectedOptions)} // Update state
                isMulti // Allow multiple selection
                placeholder="Select users to share with"
              />
            </div>)}

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
            <div key={note.id} className={note.is_owner ? "note-owner" : "note-other"}>
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
              <p className={note.is_owner ? "date-owner" : "date-other"}>{note.formattedDate}</p>

              <div className="shared-users">
                {note.shared_with.map((user, index) => (
                  <div key={index} className="user-circle" title={getFullName(user)}>
                    {getUserInitial(user)}
                  </div>
                ))}
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
