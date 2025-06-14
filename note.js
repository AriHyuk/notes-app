async function fetchNotes() {
  document.getElementById("notes-section").innerHTML = `
         <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
           <h4 class="m-0">${
             currentEditingNoteId ? "Edit Note" : "Create New Note"
           }</h4>
           <button class="btn btn-outline-danger" onclick="logout()">Logout</button>
         </div>
         <form id="note-form" class="card p-4 shadow-sm mb-4" enctype="multipart/form-data">
           <div class="mb-3">
             <input type="text" id="note-title" class="form-control" placeholder="Note title" />
           </div>
           <div class="mb-3">
             <textarea id="note-content" class="form-control" rows="3" placeholder="Note content"></textarea>
           </div>
           <div class="mb-3">
             <input type="file" id="note-file" class="form-control" />
             <div id="existing-attachment" class="attachment-preview"></div>
           </div>
           <button class="btn btn-${
             currentEditingNoteId ? "primary" : "success"
           } w-100">
             ${currentEditingNoteId ? "Update Note" : "Add Note"}
           </button>
           ${
             currentEditingNoteId
               ? '<button type="button" class="btn btn-outline-secondary w-100 mt-2" onclick="cancelEdit()">Cancel</button>'
               : ""
           }
         </form>
         <input type="text" id="search-query" class="form-control mb-3" placeholder="Search notes..." onkeyup="searchNotes()" />
         <ul id="note-list" class="list-group"></ul>`;

  document
    .getElementById("note-form")
    .addEventListener("submit", currentEditingNoteId ? updateNote : createNote);
  if (currentEditingNoteId) await loadNoteForEditing(currentEditingNoteId);

  const res = await fetch(`${API_URL}/note`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  renderNotes(data.data);
}

async function loadNoteForEditing(noteId) {
  const res = await fetch(`${API_URL}/note/${noteId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (data.status === "success") {
    document.getElementById("note-title").value = data.data.title;
    document.getElementById("note-content").value = data.data.content;
    const attachment = data.data.attachments?.[0];
    if (attachment) {
      currentEditingAttachment = attachment;
      document.getElementById(
        "existing-attachment"
      ).innerHTML = `📎 <a href="${attachment.url}" target="_blank">${attachment.filename}</a>`;
    } else {
      currentEditingAttachment = null;
      document.getElementById("existing-attachment").innerHTML = "";
    }
  } else {
    Swal.fire("Error", data.message || "Failed to load note", "error");
  }
}

function cancelEdit() {
  currentEditingNoteId = null;
  fetchNotes();
}

async function searchNotes() {
  const query = document.getElementById("search-query").value;
  if (!query) return fetchNotes();
  const res = await fetch(`${API_URL}/note/search/${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  renderNotes(data.data);
}

function renderNotes(notes) {
  const list = document.getElementById("note-list");
  list.innerHTML = "";
  if (notes?.length) {
    notes.forEach((note) => {
      const item = document.createElement("li");
      item.className = "list-group-item";
      const attachment = note.attachments?.length
        ? `<br/><a href="${note.attachments[0].url}" target="_blank">📎 ${note.attachments[0].filename}</a>`
        : "";
      item.innerHTML = `
             <div class="d-flex justify-content-between align-items-center">
               <div>
                 <strong>${note.title}</strong><br/><small class="note-content">${note.content}</small>${attachment}
               </div>
               <div class="btn-group">
                 <button class="btn btn-sm btn-primary" onclick="editNote('${note.noteId}')">Edit</button>
                 <button class="btn btn-sm btn-danger" onclick="deleteNote('${note.noteId}')">Delete</button>
               </div>
             </div>`;
      list.appendChild(item);
    });
  } else {
    list.innerHTML =
      '<li class="list-group-item text-muted">No notes found.</li>';
  }
}
