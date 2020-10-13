
const createListBtn = document.querySelector(".create-list-btn");
const inputTextList = document.querySelector(".input-text-list");
const addListBtn = document.querySelector("#add-list-btn");
const addItemsAction = document.querySelector(".add-items-action");
const displayItemsAction = document.querySelector(".display-items-action");
const noteValueInput = document.querySelector(".input-text");
const addItemBtn = document.querySelector(".addItemBtn");
const modal = document.querySelector(".modal");
const addFirstItem = document.querySelector(".add-first-item");
const emptyList = document.querySelector(".empty-list");
const closeMenu = document.querySelector(".close-menu");

// event listeners

addItemBtn.addEventListener("click", addItem);
document.addEventListener("DOMContentLoaded", whatDisplay);
modal.addEventListener("click", removeItems);
document.addEventListener("DOMContentLoaded", displayClearAll);
document.addEventListener("DOMContentLoaded", addListsToMenu);
listDOM.addEventListener("click", removeSingleItem);
listDOM.addEventListener("click", editItem);
listDOM.addEventListener("keydown", (event) => saveItemEnter(event));
listDOM.addEventListener("click", check);
createListBtn.addEventListener("click", createList);
noInternetMessage = document.querySelector(".no-internet-message")

var intervalID = window.setInterval(myCallback, 60000);
var previousInternetStatus = false;

function myCallback() {
  var online = navigator.onLine;
  if (online) {
    noInternetMessage.classList.remove("show");
    if (!previousInternetStatus) checkInternetAndSave();
  } else {
    noInternetMessage.classList.add("show");
  }
  previousInternetStatus = online;
}

let currentListId = "";

function getListIdFromUrl() {
  let url_string = location.href;
  let url = new URL(url_string);
  return url.searchParams.get("list");
}

function whatDisplay() {
  let listID = getListIdFromUrl();
  if (listID) {
    currentListId = listID;
    showListView(listID);
    showSideMenuView();
    if (window.innerWidth < 600) toggleMenu()
  }
  else {
    showListView(listID);
  }
}

async function createList(e) {
  e.preventDefault();
  showNotesAddUI();
  let listName = inputTextList.value;
  let temporaryId = Math.floor(Math.random() * 10000);
  let listId = await addList(listName, temporaryId);
  saveListInStorage({ id: listId, name: listName, notes: [] }, temporaryId);
  displayClearAll();
}

function saveListInStorage(list, tempId) {
  let lists = getListsFromStorage();
  if (list.id === tempId) {
    let tempLists = getTempListsFromStorage();
    tempLists.push(list);
    localStorage.setItem("tempLists", JSON.stringify(tempLists));
  }
  lists.push(list);
  localStorage.setItem("lists", JSON.stringify(lists));
  addListToMenu(list);
  location.replace(`${location.pathname}?list=${list.id}`);
}

function removeList(trashIcon) {
  let listToRemoveId = removeListFromMenu(trashIcon);
  deleteList(listToRemoveId);
  deleteListFromStorage(listToRemoveId);
}

async function addItem(event) {
  event.preventDefault();
  if (validateInputValue(noteValueInput.value)) {
    let currentListId = getListIdFromUrl();
    if (currentListId) {
      let temporaryId = Math.floor(Math.random() * 10000);
      addNoteToInterface({ value: noteValueInput.value, id: temporaryId });
      let note = await addNote(currentListId, noteValueInput.value, temporaryId);
      saveItemInStorage(note, temporaryId);
      noteValueInput.value = "";
    }
    else alert("Something went wrong.");
  }
}

function showAction(element, text) {
  element.classList.add("alert");
  element.innerText = text;
  noteValueInput.value = "";
  setTimeout(function () {
    element.classList.remove("alert");
  }, 2500);
}

function saveItemInStorage(note, tempId) {

  if (note.id != tempId) {
    let element = document.getElementById(tempId);
    element.id = note.id;
  }
  else {
    addTempNoteToStorage({ id: tempId, listId: note.listId })
    markNoteAsTemp(tempId);
  }
  addNoteToStorageList(note);
}

async function checkLists() {
  let tempLists = JSON.parse(localStorage.getItem("tempLists"));
  if (!tempLists)
    return;

  let listsFromStorage = JSON.parse(localStorage.getItem("lists"));
  for (const tempList of tempLists)
    for (const list of listsFromStorage) {
      if (tempList.id == list.id) {
        let newId = await addTempListToServer(list.name);
        replaceTempListInStorage(newId, tempList.id);
        replaceTempListDOM(tempList.id, newId);
      }
    }
}

async function checkNotes() {
  let tempNotes = JSON.parse(localStorage.getItem("tempNotes"));
  if (!tempNotes)
    return;

  let listsFromStorage = getListsFromStorage();

  for (const tempNote of tempNotes) {
    let listId;
    let note;
    for (const list of listsFromStorage) {
      note = list.notes.find((note) => note.id === tempNote.id);
      if (list.notes.includes(note)) {
        listId = list.id;
      }
    }
    if (!note || !listId)
      return;

    let newId = await addTempNoteToServer(listId, note.value, tempNote.id);
    replaceTempNoteInStorage(newId, listId, tempNote.id);
    let element = document.getElementById(tempNote.id);
    element.id = newId;
    unmarkNoteAsTemp(newId)
  }
}

async function checkInternetAndSave() {
  console.log("connected");
  await checkLists();
  await checkNotes();
  replaceListInUrl();
}

function replaceListInUrl() {
  let listFromUrl = getListIdFromUrl();
  let listFromDom = getListFromDom();
  if (listFromUrl != listFromDom)
    location.replace(`${location.pathname}?list=${listFromDom}`);
}

function removeItems() {
  if (event.target.classList.contains("yes")) {
    let listID = getListIdFromUrl();
    let listsFromStorage = JSON.parse(localStorage.getItem("lists"));
    listsFromStorage.map((list) => {
      if (list.id === listID) {
        deleteAllNotes(list.id);
      }
    });
    console.log(listID, listsFromStorage);
    listsFromStorage.forEach((list) => {
      if (list.id === listID) {
        let notes = list.notes;
        console.log(notes);
        list.notes = [];
      }
      localStorage.setItem("lists", JSON.stringify(listsFromStorage));
    });
    let items = document.querySelectorAll(".grocery-item");
    items.forEach(function (element) {
      listDOM.removeChild(element);
    });
    modal.style.display = "none";
    displayClearAll();
  } else if (event.target.classList.contains("no")) {
    modal.style.display = "none";
  }
}

async function removeSingleItem() {
  event.preventDefault();
  let link = event.target.parentElement;
  let text = link.parentElement.parentElement.firstElementChild.innerHTML;
  let noteID = link.parentElement.parentElement.firstElementChild.id;
  let groceryItem = event.target.parentElement.parentElement.parentElement;
  if (event.target.parentElement.classList.contains("grocery-item-delete")) {
    listDOM.removeChild(groceryItem);
    await deleteNote(noteID);
    removeSingleFromStorage(noteID);
    displayClearAll();
  }
}

async function editItem(event) {
  event.preventDefault();
  let link = event.target.parentElement;
  let groceryItemTitle = link.parentElement.firstElementChild.firstElementChild.nextElementSibling.firstElementChild;
  console.log(groceryItemTitle);
  if (event.target.classList.contains("grocery-item-edit")) {
    let editable = document.createAttribute("contenteditable");
    editable.value = "true";
    groceryItemTitle.setAttributeNode(editable);
    groceryItemTitle.focus();
    setEndOfContenteditable(groceryItemTitle);
    event.target.style.display = "none";
    event.target.nextElementSibling.style.display = "inline-block";
  }
  if (event.target.classList.contains("grocery-item-save")) {
    let noteID = link.parentElement.firstElementChild.id;
    let text =
      event.target.parentElement.parentElement.firstElementChild.firstElementChild.innerHTML;
    console.log(text);
    if (navigator.onLine)
      await editNote(noteID, text);
    editInStorage(text, noteID);
    event.target.style.display = "none";
    event.target.previousElementSibling.style.display = "inline-block";
    groceryItemTitle.removeAttribute("contenteditable");
  }
}

function setEndOfContenteditable(contentEditableElement) {
  var range, selection;
  if (document.createRange) {
    range = document.createRange();
    range.selectNodeContents(contentEditableElement);
    range.collapse(false);
    selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.selection) {
    range = document.body.createTextRange();
    range.moveToElementText(contentEditableElement);
    range.collapse(false);
    range.select();
  }
}

function editInStorage(text, noteID) {
  let lists = getListsFromStorage();
  lists.filter((list) => {
    list.notes.filter((note) => {
      if (note.id == noteID) {
        note.value = text;
      }
    });
  });
  localStorage.setItem("lists", JSON.stringify(lists));
}

function check() {
  event.preventDefault();
  let link = event.target.parentElement;
  let text = link.parentElement.parentElement.firstElementChild.firstElementChild.nextElementSibling;
  console.log(text);
  if (link.classList.contains("grocery-item-check")) {
    text.classList.toggle("crossed");
    if (text.classList.contains("crossed")) {
      link.innerHTML = `<img width="15rem" src="images/check-square.svg" alt="check">`
    } else {
      link.innerHTML = `<img width="15rem" src="images/square-regular.svg" alt="check">`
    }
  }
}

function saveItemEnter(event) {
  let edit =
    event.target.parentElement.parentElement.parentElement.lastElementChild.lastElementChild.previousElementSibling;
  let save =
    event.target.parentElement.parentElement.parentElement.lastElementChild.lastElementChild;
  if (
    event.target.classList.contains("grocery-item-value") &&
    event.keyCode === 13
  ) {
    let text = event.target.innerHTML;
    let noteID = event.target.parentElement.id;
    save.style.display = "none";
    edit.style.display = "inline-block";
    editNote(noteID, text);
    editInStorage(text, noteID);
    event.target.removeAttribute("contenteditable");
  }
}
