async function addList(listName, tempId) {
  return fetch("https://kurocapture.pl/Unicorn/AddList", {
    body: "listName=" + listName,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  })
    .then((response) => response.text())
    .then((response) => {
      return response;
    })
    .catch(() => {
      return tempId;
    });
}

async function addTempListToServer(listName) {
  return fetch("https://kurocapture.pl/Unicorn/AddList", {
    body: "listName=" + listName,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  })
    .then((response) => response.text())
    .then((response) => {
      return response;
    });
}

async function addNote(listID, noteValue, tempId) {

  let note = {};
      note.id = tempId;
      note.value = noteValue;
      note.listId = listID;

  return fetch("https://kurocapture.pl/Unicorn/AddNote", {
    body: `listId=${listID}&noteValue=${noteValue}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  })
    .then((response) => response.text())
    .then((response) => {
      note.id = response;
      return note;
    })
    .catch(() => {    
      return note;
    });
}

async function addTempNoteToServer(listID, noteValue) {
  return fetch("https://kurocapture.pl/Unicorn/AddNote", {
    body: `listId=${listID}&noteValue=${noteValue}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  })
    .then((response) => response.text())
    .then((response) => {
      return response;
    });
}

function refreshList(listID) {
  fetch(`https://kurocapture.pl/Unicorn/GetNotesFromList?listId=${listID}`, {
    method: "get",
  })
    .then((response) => response.text())
    .then((response) => {
      let notes = JSON.parse(response);
      let list = document.querySelector(".display-items-list");
      list.innerHTML = "";
      notes.forEach((element) => {
        let value = element.no_NoteValue;
        let id = element.no_NoteId;
        createItem(value, id);
      });
    });
}

async function deleteNote(noteID) {
  fetch("https://kurocapture.pl/Unicorn/DeleteNote", {
    body: `noteId=${noteID}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  });
}

async function deleteList(listID) {
  fetch("https://kurocapture.pl/Unicorn/DeleteList", {
    body: `listId=${listID}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  });
}

async function deleteAllNotes(listID) {
  fetch("https://kurocapture.pl/Unicorn/DeleteAllNotesFromList", {
    body: `listId=${listID}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  });
}

async function editNote(noteID, newValue) {
  fetch("https://kurocapture.pl/Unicorn/EditNote", {
    body: `noteId=${noteID}&newValue=${newValue}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  });
}
