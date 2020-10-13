function getListsFromStorage() {
  return localStorage.getItem("lists")
    ? JSON.parse(localStorage.getItem("lists"))
    : [];
}

function getTempListsFromStorage() {
  return localStorage.getItem("tempLists")
    ? JSON.parse(localStorage.getItem("tempLists"))
    : [];
}

function getTempNotesFromStorage() {
  return localStorage.getItem("tempNotes")
    ? JSON.parse(localStorage.getItem("tempNotes"))
    : [];
}

function addNoteToStorageList(note) {
  let listsFromStorage = getListsFromStorage();
  listsFromStorage.map((list) => {
    if (list.id == note.listId) {
      list.notes.push(note);
      localStorage.setItem("lists", JSON.stringify(listsFromStorage));
    }
  });
}

function addTempNoteToStorage(tempNote) {
  let tempNotes = getTempNotesFromStorage();
  tempNotes.push(tempNote);
  localStorage.setItem("tempNotes", JSON.stringify(tempNotes));
}

function getNotesFromList(listId) {
  let lists = getListsFromStorage();
  let notes = lists.find(list => list.id == listId).notes;
  return notes;
}

function deleteListFromStorage(listToRemoveId) {
  let lists = getListsFromStorage();
  let listToRemove = lists.find(list => list.id == listToRemoveId);
  let index = lists.indexOf(listToRemove);
  lists.splice(index, 1);
  localStorage.setItem("lists", JSON.stringify(lists));
}

function replaceTempListInStorage(newId, tempId) {
  let listsFromStorage = getListsFromStorage();

  listsFromStorage.forEach((list) => {
    if (list.id === tempId) {
      list.id = newId;
      removeTempList(tempId)
    }
  });

  localStorage.setItem("lists", JSON.stringify(listsFromStorage));
}

function removeTempList(id) {
  let tempLists = getTempListsFromStorage();
  let tempListToRemove = tempLists.find(tempList => tempList.id == id);
  let index = tempLists.indexOf(tempListToRemove);
  tempLists.splice(index, 1);
  localStorage.setItem("tempLists", JSON.stringify(tempLists));
}

function replaceTempNoteInStorage(newNoteId, newListId, tempId) {
  let listsFromStorage = JSON.parse(localStorage.getItem("lists"));

  listsFromStorage.forEach((list) => {
    let note = list.notes.find((note) => note.id == tempId);
    note.id = newNoteId;
    note.listId = newListId;
    removeTempNote(tempId)
  });
  localStorage.setItem("lists", JSON.stringify(listsFromStorage));
}

function removeTempNote(tempId) {
  let tempNotes = getTempNotesFromStorage();
  let tempNoteToRemove = tempNotes.find(tempNote => tempNote.id == tempId);
  let index = tempNotes.indexOf(tempNoteToRemove);
  tempNotes.splice(index, 1);
  localStorage.setItem("tempNotes", JSON.stringify(tempNotes));
}

function removeSingleFromStorage(noteID) {
  let lists = JSON.parse(localStorage.getItem("lists"));
  let listID = getListIdFromUrl();
  lists.map((list) => {
    if (listID == list.id) {
      let notes = list.notes;
      notes.filter(function (note) {
        if (note.id == noteID) {
          let index = notes.indexOf(note);
          notes.splice(index, 1);
          localStorage.setItem("lists", JSON.stringify(lists));
          if (note.id.toString().length < 32)
            removeTempNote(note.id)
        }
      });
    }
  });
}