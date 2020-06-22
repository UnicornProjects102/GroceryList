const addListContainer = document.querySelector(".add-list-container");
const createListBtn = document.querySelector(".create-list-btn");
const inputTextList = document.querySelector(".input-text-list");
const content = document.querySelector(".content");
const addListBtn = document.querySelector("#add-list-btn");
const addItemsAction = document.querySelector(".add-items-action");
const displayItemsAction = document.querySelector(".display-items-action");
const input = document.querySelector(".input-text");
const addItemBtn = document.querySelector(".addItemBtn");
const listDOM = document.querySelector(".display-items-list");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const clearAll = document.querySelector(".clear-button");
const addFirstItem = document.querySelector(".add-first-item");
const emptyList = document.querySelector(".empty-list");
const displayItemsCont = document.querySelector(".display-items-container");
const addItemsCont = document.querySelector(".add-items-container");
const plus = document.querySelector(".plus");
const sideMenu = document.querySelector(".side_menu");
const bars = document.querySelector(".bars");
const displayItemsTitle = document.querySelector(".display-items-title");
const yourLists = document.querySelector(".your_lists");
const sideMenuAdd = document.querySelector(".side_menu_add");
const firstListBtn = document.querySelector(".first_list_btn");
const addFirstList = document.querySelector(".add_first_list");
const closeMenu = document.querySelector(".close-menu");

// event listeners

addItemBtn.addEventListener("click", addItem);
document.addEventListener("DOMContentLoaded", whatDisplay);
modal.addEventListener("click", removeItems);
document.addEventListener("DOMContentLoaded", displayClearAll);
document.addEventListener("DOMContentLoaded", showAddFirstItem);
document.addEventListener("DOMContentLoaded", showListsInMenu);
listDOM.addEventListener("click", removeSingleItem);
listDOM.addEventListener("click", editItem);
listDOM.addEventListener("keydown", saveItemEnter);
listDOM.addEventListener("click", check);
plus.addEventListener("click", showAdding);
close.addEventListener("click", closeAdding);
sideMenuAdd.addEventListener("click", showListAdding);
createListBtn.addEventListener("click", createList);
bars.addEventListener("click", showMenu);
sideMenu.addEventListener("click", hideMenu);
sideMenu.addEventListener("click", displayList);
firstListBtn.addEventListener("click", showListAdding);

//var intervalID = window.setInterval(myCallback, 1000000);
var previousInternetStaus = false;

function myCallback() {
  var noInternet = document.getElementById("noInternet");
  var online = navigator.onLine;
  if (online) {
    // noInternet.style.display = "none";
    if (!previousInternetStaus) checkInternetAndSave();
  } else {
    // noInternet.style.display = "block";
  }
  previousInternetStaus = online;
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
    let lists = JSON.parse(localStorage.getItem("lists"));
    if (!lists) {
      addFirstList.style.display = "inline-block";
    } else {
      displayStorage(listID);
    }
  } else {
    sideMenu.style.display = "flex";
  }
}

function hideMenu(e) {
  if (
    (sideMenu.style.display === "flex") &
    e.target.classList.contains("close_menu")
  ) {
    sideMenu.style.display = "none";
  }
}

function showMenu() {
  if (sideMenu.style.display === "none" || sideMenu.style.display === "") {
    sideMenu.style.display = "flex";
  } else {
    sideMenu.style.display = "none";
  }
}

function showListAdding(e) {
  e.preventDefault();
  sideMenu.style.display = "none";
  addFirstList.style.display = "none";
  displayItemsCont.style.display = "none";
  addItemsCont.style.display = "none";
  addListContainer.style.display = "inline-block";
  inputTextList.value = "";
}

function createList(e) {
  e.preventDefault();
  content.style.display = "block";
  displayItemsCont.style.display = "flex";
  addItemsCont.style.display = "flex";
  addListContainer.style.display = "none";
  let listName = inputTextList.value;
  let temporaryId = Math.floor(Math.random() * 10000);
  let notes = [];
  addList(listName, temporaryId, notes);
  displayClearAll();
}

function saveListInStorage(list, tempId) {
  let lists;
  lists = localStorage.getItem("lists")
    ? JSON.parse(localStorage.getItem("lists"))
    : [];

  // if(list.id !== tempId){
  //   let element = document.getElementById(tempId);
  //   element.id = list.id;
  //   }
  if (list.id === tempId) {
    let tempLists;
    tempLists = localStorage.getItem("tempLists")
      ? JSON.parse(localStorage.getItem("tempLists"))
      : [];
    let tempList = {
      id: tempId,
      name: list.name,
    };
    tempLists.push(tempList);
    localStorage.setItem("tempLists", JSON.stringify(tempLists));
  }
  if (list.notes.length > 0) {
    list.notes.map((note) => {
      note.listId = list.id;
    });
  }

  lists.push(list);
  localStorage.setItem("lists", JSON.stringify(lists));

  showListInMenu(list);
  location.replace(`${location.pathname}?list=${list.id}`);
}

function showListInMenu(list) {
  let lists = JSON.parse(localStorage.getItem("lists"));
  let tempLists = JSON.parse(localStorage.getItem("tempLists"));
  if (lists || tempLists) {
    yourLists.innerHTML += `
  <li class="list_link" id="${list.id}">
  <p id="${list.id}">${list.name}</p>
  <a onclick="removeList(this)" class="delete_list"><img width="15rem" src="images/trash-alt.svg" alt="trash"></a>
  </li>
  `;
  }
}

function showListsInMenu() {
  let lists = JSON.parse(localStorage.getItem("lists"));
  if (lists) {
    lists.map((list) => {
      yourLists.innerHTML += `<li class="list_link" id="${list.id}">
      <p id="${list.id}">${list.name}</p>
      <a onclick="removeList(this)" class="delete_list"><img width="15rem" src="images/trash-alt.svg" alt="trash"></a>
      </li>`;
    });
  }
}

function removeList(trashIcon) {
  let lists = trashIcon.parentElement.parentElement;
  let listToDelete = trashIcon.parentElement;
  lists.removeChild(listToDelete);
  deleteList(listToDelete.id);
}

function showAddFirstItem() {
  let lists = JSON.parse(localStorage.getItem("lists"));
  if (lists) {
    let url = getListIdFromUrl();
    lists.find((list) => {
      if (list.id === url) {
        let currentNotes = list.notes;
        if (window.screen.width <= 450 && currentNotes.length === 0) {
          addFirstItem.style.display = "block";
        } else {
          plus.style.animationName = "none";
        }
      }
    });
  }
}

function showAdding() {
  addItemsCont.style.display = "block";
  close.style.display = "block";
  input.focus();
  addFirstItem.style.display = "none";
  plus.style.animationName = "none";
}

function closeAdding() {
  addItemsCont.style.display = "none";
  close.style.display = "none";
}

function addItem(event) {
  event.preventDefault();
  let value = input.value;
  if (value === "") {
    showAction(addItemsAction, "Please, add a grocery item.", false);
  } else {
    input.value = "";
    let currentListId = getListIdFromUrl();
    if (currentListId) {
      let temporaryId = Math.floor(Math.random() * 100);
      createItem(value, temporaryId);
      addNote(currentListId, value, temporaryId);
    } else alert("Something went wrong.");
    // updateStorage(value);
  }
}

function showAction(element, text, value) {
  if (value === true) {
    element.classList.add("success");
    element.innerText = text;
    input.value = "";
    setTimeout(function () {
      element.classList.remove("success");
    }, 1500);
  } else {
    element.classList.add("alert");
    element.innerText = text;
    input.value = "";
    setTimeout(function () {
      element.classList.remove("alert");
    }, 2500);
  }
}

function createItem(value, id) {
  let div = document.createElement("div");
  div.classList.add("grocery-item");
  div.innerHTML = `<p  id="${id}" class="grocery-item-title">${value}</p>
                   <input type="hidden"  value="${value}" />
          <div class="grocery-item-icons">
            
            <a href="#" class="grocery-item-delete">
              <img width="15rem" src="images/trash-alt.svg" alt="trash">
            
            </a>
            <a href="#" class="grocery-item-check">
              <img width="15rem" src="images/check-square.svg" alt="check">
            
            </a>
            <a href="#" class="grocery-item-edit">
              edit
            </a>
            <a href="#" class="grocery-item-save">
              save
            </a>
            </div>`;

  listDOM.appendChild(div);
  displayClearAll();
}

function saveItemInStorage(note, tempId) {
  let listID = note.listId;
  let listsFromStorage = JSON.parse(localStorage.getItem("lists"));

  if (note.id != tempId) {
    let element = document.getElementById(tempId);
    element.id = note.id;
  } else {
    let tempNotes;
    tempNotes = localStorage.getItem("tempNotes")
      ? JSON.parse(localStorage.getItem("tempNotes"))
      : [];
    let tempNote = {
      id: tempId,
      listId: listID,
    };
    tempNotes.push(tempNote);
    localStorage.setItem("tempNotes", JSON.stringify(tempNotes));
    let tempNoteUI = document.getElementById(tempId);
    tempNoteUI.style.opacity = "0.5";
    showAction(
      displayItemsAction,
      "No internet connection. Item will be saved locally.",
      false
    );
    //let tempLists = JSON.parse(localStorage.getItem("tempLists"));
    // if (!tempLists) {
    //   setInterval(checkInternetAndSave(), 60000);
    // }
  }

  listsFromStorage.map((list) => {
    if (list.id == listID) {
      list.notes.push(note);
      localStorage.setItem("lists", JSON.stringify(listsFromStorage));
    }
  });
}

function ReplaceTempListInStorage(newList, tempId) {
  let listsFromStorage = JSON.parse(localStorage.getItem("lists"));

  listsFromStorage.forEach((list) => {
    if (list.id === tempId) {
      list.id = newList.id;
    }
  });
  localStorage.setItem("lists", JSON.stringify(listsFromStorage));
}

function ReplaceTempNoteInStorage(newNote, tempId) {
  let listsFromStorage = JSON.parse(localStorage.getItem("lists"));

  listsFromStorage.forEach((list) => {
    list.notes.find((note) => note.id === tempId).id = newNote.id;
    // note.id = newNote.id;
    // if (list.notes.includes(note)) {

    //   break;
    // }
  });
  localStorage.setItem("lists", JSON.stringify(listsFromStorage));
}

function checkInternetAndSave() {
  //  window.addEventListener("online", () => {
  let tempLists = JSON.parse(localStorage.getItem("tempLists"));
  let tempNotes = JSON.parse(localStorage.getItem("tempNotes"));
  if (!tempLists && !tempNotes) return;

  console.log("connected");
  //let tempNotes = JSON.parse(localStorage.getItem("tempNotes"));
  //let tempLists = JSON.parse(localStorage.getItem("tempLists"));

  if (tempLists) {
    let listsFromStorage = JSON.parse(localStorage.getItem("lists"));

    tempLists.forEach((tempList) => {
      listsFromStorage.map((list) => {
        if (tempList.id == list.id) {
         await addTempListToServer(list.name, list.id, list.notes);
          // let index = tempLists.indexOf(tempList);
          // listsFromStorage.splice(index, 1);
          // localStorage.setItem("lists", JSON.stringify(listsFromStorage));
        }
      });
    });
    localStorage.removeItem("tempLists");
    // saveItemsFromList();
  }

  if (tempNotes) {
    let listsFromStorage = JSON.parse(localStorage.getItem("lists"));

    tempNotes.forEach((tempNote) => {
      let listId;
      let note;
      listsFromStorage.forEach((list) => {
        note = list.notes.find((note) => note.id === tempNote.id);
        if (list.notes.includes(note)) {
          listId = list.id;
        }
      });
      await addTempNoteToServer(listId, note.value, tempNote.id);
    });
    localStorage.removeItem("tempNotes");
    // listsFromStorage.filter((list) => {
    //   if (tempNote.listId === list.id) {
    //     list.notes.filter((note) => {
    //       if (note.id === tempNote.id) {
    //         addNote(note.listId, note.value, tempNote.id);

    //         let tempNoteUI = document.getElementById(tempNote.id);
    //         tempNoteUI.style.opacity = "1";

    //         let index = list.notes.indexOf(note);
    //         list.notes.splice(index, 1);
    //         localStorage.setItem("lists", JSON.stringify(listsFromStorage));
    //       }
    //     });
    //   }
    // });

    // localStorage.removeItem("tempNotes");
  }
}

function findListId(list) {}

function saveItemsFromList() {
  let tempNotes = JSON.parse(localStorage.getItem("tempNotes"));
  let listsFromStorage = JSON.parse(localStorage.getItem("lists"));
  tempNotes.forEach((tempNote) => {
    listsFromStorage.filter((list) => {
      if (tempNote.listId === list.id) {
        list.notes.filter((note) => {
          if (note.id === tempNote.id) {
            addNote(note.listId, note.value, tempNote.id);

            let tempNoteUI = document.getElementById(tempNote.id);
            tempNoteUI.style.opacity = "1";

            let index = list.notes.indexOf(note);
            list.notes.splice(index, 1);
            localStorage.setItem("lists", JSON.stringify(listsFromStorage));
          }
        });
      }
    });
  });
  localStorage.removeItem("tempNotes");
}

function displayList(e) {
  if (
    e.target.classList.contains("list_link") ||
    e.target.parentElement.classList.contains("list_link")
  ) {
    let listID = e.target.id;
    var a = window.location.pathname;
    sideMenu.style.display = "none";
    addListContainer.style.display = "none";
    content.style.display = "block";
    displayClearAll();
    if (localStorage.tempLists && listID.length < 10) {
      let listsFromStorage = JSON.parse(localStorage.getItem("lists"));
      listDOM.innerHTML = "";
      listsFromStorage.find((list) => {
        if (list.id == listID) {
          list.notes.map((note) => {
            createItem(note.value, note.id);
            displayItemsTitle.innerHTML = `${list.name}`;
            document.getElementById(`${note.id}`).style.opacity = "0.5";
          });
        }
      });
    } else {
      location.replace(`${a}?list=${listID}`);
    }
  }
}

function displayStorage(listID) {
  content.style.display = "block";
  if (localStorage.lists) {
    let lists = JSON.parse(localStorage.getItem("lists"));
    lists.map((item) => {
      if (item.id == listID) {
        displayItemsTitle.innerHTML = `${item.name}`;
        if (typeof item.id === "number") {
          displayItemsTitle.style.opacity = "0.5";
          showAction(
            displayItemsAction,
            "No internet connection. Items will be saved locally.",
            false
          );
        }
      }
    });
    if (localStorage.tempLists) {
      let listsFromStorage = JSON.parse(localStorage.getItem("lists"));
      listDOM.innerHTML = "";
      listsFromStorage.find((list) => {
        if (list.id == listID) {
          list.notes.map((note) => {
            createItem(note.value, note.id);
            displayItemsTitle.innerHTML = `${list.name}`;
            document.getElementById(`${note.id}`).style.opacity = "0.5";
          });
        }
      });
      // let unSavedNotes = [];
      // listsFromStorage.filter((list) => {
      //   list.notes.filter((note) => {
      //     noteID = note.id;
      //     if (typeof noteID === "number") {
      //       unSavedNotes.push(note);
      //     }
      //   });
      // });
      // if (unSavedNotes.length < 1) {
      //   localStorage.removeItem("tempLists");
      //   localStorage.removeItem("tempNotes");
      // }
      // checkInternetAndSave();
      // saveItemsFromList();
    }
    if (localStorage.tempNotes || localStorage.tempLists) {
      lists.find((list) => {
        if (list.id === listID) {
          list.notes.map((note) => {
            createItem(note.value, note.id);
            if (typeof note.id === "number") {
              document.getElementById(`${note.id}`).style.opacity = "0.5";
            }
          });
        }
      });
      // if (navigator.onLine){
      //   console.log("connected")
      //   let tempNotes = JSON.parse(localStorage.getItem("tempNotes"))
      //   let listsFromStorage = JSON.parse(localStorage.getItem("lists"))
      //   let tempLists = JSON.parse(localStorage.getItem("tempLists"))
      //   if (tempNotes && !tempLists){
      //     tempNotes.forEach(tempNote => {
      //       listsFromStorage.find(list =>{
      //         if (tempNote.listId === list.id){
      //           list.notes.find(note =>{
      //             if(note.id === tempNote.id){
      //               addNote(note.listId, note.value, tempNote.id)
      //               let index = list.notes.indexOf(note)
      //               list.notes.splice(index, 1);
      //               localStorage.setItem("lists", JSON.stringify(listsFromStorage))
      //             }
      //           })
      //           }
      //           refreshList(list.id)
      //       })
      //     })
      //   }
      // localStorage.removeItem("tempNotes")
      // }
    } else refreshList(listID);
  }
  displayClearAll();
}

function displayClearAll() {
  if (listDOM.childNodes.length != 0) {
    clearAll.style.display = "block";
    emptyList.style.display = "none";
  } else {
    clearAll.style.display = "none";
    emptyList.style.display = "block";
  }
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

function removeSingleItem() {
  event.preventDefault();
  let link = event.target.parentElement;
  let text = link.parentElement.parentElement.firstElementChild.innerHTML;
  let noteID = link.parentElement.parentElement.firstElementChild.id;
  let groceryItem = event.target.parentElement.parentElement.parentElement;
  if (event.target.parentElement.classList.contains("grocery-item-delete")) {
    listDOM.removeChild(groceryItem);
    deleteNote(noteID);
    removeSingleFromStorage(noteID);
    displayClearAll();
  }
}

function removeSingleFromStorage(noteID) {
  let lists = JSON.parse(localStorage.getItem("lists"));
  let listID = getListIdFromUrl();
  lists.map((list) => {
    if (listID === list.id) {
      let notes = list.notes;
      notes.filter(function (note) {
        if (note.id === noteID) {
          let index = notes.indexOf(note);
          notes.splice(index, 1);
          localStorage.setItem("lists", JSON.stringify(lists));
        }
      });
    }
  });
}

function editItem(event) {
  event.preventDefault();
  let link = event.target.parentElement;
  let groceryItemTitle = link.parentElement.firstElementChild;
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
      event.target.parentElement.parentElement.firstElementChild.innerHTML;
    console.log(text);
    editNote(noteID, text);
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
  let lists = JSON.parse(localStorage.getItem("lists"));
  lists.filter((list) => {
    list.notes.filter((note) => {
      if (note.id === noteID) {
        note.value = text;
      }
    });
  });
  localStorage.setItem("lists", JSON.stringify(lists));
}

function check() {
  event.preventDefault();
  let link = event.target.parentElement;
  let text = link.parentElement.parentElement.firstElementChild;

  if (event.target.parentElement.classList.contains("grocery-item-check")) {
    text.classList.toggle("crossed");
  }
}

function saveItemEnter() {
  let edit =
    event.target.nextElementSibling.nextElementSibling.firstElementChild
      .nextElementSibling.nextElementSibling;
  let save =
    event.target.nextElementSibling.nextElementSibling.firstElementChild
      .nextElementSibling.nextElementSibling.nextElementSibling;
  if (
    event.target.classList.contains("grocery-item-title") &&
    event.keyCode === 13
  ) {
    let text = event.target.innerHTML;
    let noteID = event.target.id;
    // let textOld = event.target.nextElementSibling.value;
    save.style.display = "none";
    edit.style.display = "inline-block";
    editNote(noteID, text);
    editInStorage(text, noteID);
    event.target.removeAttribute("contenteditable");
  }
}
