function addList(listName) {
  return fetch("https://kurocapture.pl/Unicorn/AddList", {
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
      list.notes = []
      saveListInStorage(list);
    });
}

function addNote(listID, noteValue) {
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
      saveItemInStorage(note);
      refreshList(listID);
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
    method: "delete",
  });
}
