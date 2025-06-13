async function createNote(event) {
  event.preventDefault();
  const title = document.getElementById("note-title").value;
  const content = document.getElementById("note-content").value;
  const file = document.getElementById("note-file").files[0];

  if (!title || !content) {
    Swal.fire("Error", "Title and content are required", "error");
    return;
  }

  try {
    const noteRes = await fetch(`${API_URL}/note`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const noteData = await noteRes.json();
    if (noteData.status === "success") {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        await fetch(`${API_URL}/note/${noteData.data.noteId}/attachment`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }
      Swal.fire("Note added", "", "success");
      document.getElementById("note-form").reset();
      fetchNotes();
    } else {
      Swal.fire("Error", noteData.message || "Failed to create note", "error");
    }
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
}

async function updateNote(event) {
  event.preventDefault();
  const title = document.getElementById("note-title").value;
  const content = document.getElementById("note-content").value;
  const file = document.getElementById("note-file").files[0];

  if (!title || !content) {
    Swal.fire("Error", "Title and content are required", "error");
    return;
  }

  try {
    const noteRes = await fetch(`${API_URL}/note/${currentEditingNoteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const noteData = await noteRes.json();
    if (noteData.status === "success") {
      if (file) {
        await fetch(`${API_URL}/note/${currentEditingNoteId}/attachment`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const formData = new FormData();
        formData.append("file", file);
        await fetch(`${API_URL}/note/${currentEditingNoteId}/attachment`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }
      Swal.fire("Note updated", "", "success");
      currentEditingNoteId = null;
      currentEditingAttachment = null;
      fetchNotes();
    } else {
      Swal.fire("Error", noteData.message || "Failed to update note", "error");
    }
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
}

async function editNote(noteId) {
  currentEditingNoteId = noteId;
  fetchNotes();
}

async function deleteNote(noteId) {
  const confirm = await Swal.fire({
    title: "Delete this note?",
    showCancelButton: true,
    confirmButtonText: "Delete",
    icon: "warning",
  });
  if (confirm.isConfirmed) {
    await fetch(`${API_URL}/note/${noteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    Swal.fire("Deleted!", "", "success");
    fetchNotes();
  }
}
