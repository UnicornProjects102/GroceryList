function addList(listName, tempId, notes) {
  fetch("https://kurocapture.pl/Unicorn/AddList", {
    body: "listName=" + listName,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  })
    .then((response) => response.text())
    .then((response) => {
      let list = {};
      list.id = response;
      list.name = listName;
      list.notes = notes;
      saveListInStorage(list, tempId);
    })
    .catch((error) => {
      console.error("Error:", error);
      let list = {};
      list.id = tempId;
      list.name = listName;
      list.notes = notes;
      // createItem(noteValue, response);
      saveListInStorage(list, tempId);
    });
  // .catch((error) => {
  //   let list = {};
  //   list.id = tempId;
  //   list.name = listName;
  //   list.notes = notes;
  //   // createItem(noteValue, response);
  //   saveListInStorage(list, tempId);
  // });
}

function addTempListToServer(listName, tempId, notes) {
  fetch("https://kurocapture.pl/Unicorn/AddList", {
    body: "listName=" + listName,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  })
    .then((response) => response.text())
    .then((response) => {
      let list = {};
      list.id = response;
      list.name = listName;
      list.notes = notes;
      ReplaceTempListInStorage(list, tempId);
    });
}

function addNote(listID, noteValue, tempId) {
  fetch("https://kurocapture.pl/Unicorn/AddNote", {
    body: `listId=${listID}&noteValue=${noteValue}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  })
    .then((response) => response.text())
    .then((response) => {
      let note = {};
      note.id = response;
      note.value = noteValue;
      note.listId = listID;
      // createItem(noteValue, response);
      saveItemInStorage(note, tempId);
      // refreshList(listID);
    })
    .catch((error) => {
      let note = {};
      note.id = tempId;
      note.value = noteValue;
      note.listId = listID;
      // createItem(noteValue, response);
      saveItemInStorage(note, tempId);
    });
}

function addTempNoteToServer(listID, noteValue, tempId) {
  fetch("https://kurocapture.pl/Unicorn/AddNote", {
    body: `listId=${listID}&noteValue=${noteValue}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  })
    .then((response) => response.text())
    .then((response) => {
      let note = {};
      note.id = response;
      note.value = noteValue;
      note.listId = listID;
      // createItem(noteValue, response);
      ReplaceTempNoteInStorage(note, tempId);
      // refreshList(listID);
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

function deleteNote(noteID) {
  fetch("https://kurocapture.pl/Unicorn/DeleteNote", {
    body: `noteId=${noteID}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  });
}

function deleteList(listID) {
  fetch("https://kurocapture.pl/Unicorn/DeleteList", {
    body: `listId=${listID}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  });
}

function deleteAllNotes(listID) {
  fetch("https://kurocapture.pl/Unicorn/DeleteAllNotesFromList", {
    body: `listId=${listID}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  });
}

function editNote(noteID, newValue) {
  fetch("https://kurocapture.pl/Unicorn/EditNote", {
    body: `noteId=${noteID}&newValue=${newValue}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "post",
  });
}
