const addListContainer = document.querySelector(".add-list-container");
const createListBtn = document.querySelector(".create-list-btn");
const inputTextList = document.querySelector(".input-text-list");
const content = document.querySelector(".content");
const addListBtn = document.querySelector("#add-list-btn");
const addItemsAction = document.querySelector(".add-items-action");
const displayItemsAction = document.querySelector(".display-items-action");
const input = document.querySelector(".input-text");
const addItemBtn = document.querySelector(".addItemBtn");
const list = document.querySelector(".display-items-list");
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
list.addEventListener("click", removeSingleItem);
// list.addEventListener("click", editItem);
list.addEventListener("keydown", saveItemEnter);
list.addEventListener("click", check);
plus.addEventListener("click", showAdding);
close.addEventListener("click", closeAdding);
sideMenuAdd.addEventListener("click", showListAdding);
createListBtn.addEventListener("click", createList);
bars.addEventListener("click", showMenu);
sideMenu.addEventListener("click", hideMenu);
sideMenu.addEventListener("click", displayList);
firstListBtn.addEventListener("click", showListAdding);

// functions

var currentListId = "";

function getListIdFromUrl(){
  var url_string = location.href;
  var url = new URL(url_string);
  return url.searchParams.get("list");
}

function whatDisplay() {

  var list = getListIdFromUrl()
  if(list){
    currentListId = list;
    let lists = JSON.parse(localStorage.getItem("lists"));
    if (!lists) {
      addFirstList.style.display = "inline-block";
    } else {
      displayStorage(list);
    }
  }
  else{
    sideMenu.style.display = "flex";
    closeMenu.style.display = "none";
  }
}

function hideMenu(e) {
  if (
    (sideMenu.style.display == "flex") &
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
  addList(listName);
  //displayItemsTitle.innerHTML = `${listName}`;
  //list.innerHTML = "";
  //emptyList.style.display = "block";
  displayClearAll();
}

function saveListInStorage(list) {
  let lists;
  let exists = localStorage.getItem("lists");
  lists = localStorage.getItem("lists")
    ? JSON.parse(localStorage.getItem("lists"))
    : [];
  lists.push(list);
  localStorage.setItem("lists", JSON.stringify(lists));
  showListsInMenu();
  location.replace(`${location.pathname}?list=${list.id}`);
}

function showListsInMenu() {
  let lists = JSON.parse(localStorage.getItem("lists"));
  lists.map((list) => {
    yourLists.innerHTML += `<li class="list_link" id="${list.id}">${list.name}</li>`;
  });
  
}

function showAddFirstItem() {
  let items = document.querySelectorAll(".grocery-item");
  if (window.screen.width <= 450 && items.length < 1) {
    addFirstItem.style.display = "block";
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
    if(currentListId)
      addNote(currentListId, value);
    else
      alert("Something went wrong.")
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
    }, 1500);
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

  list.appendChild(div);
  emptyList.style.display = "none";
  displayClearAll();
}

function saveItemInStorage(note) {
  let listID = note.listId
  let listsFromStorage = JSON.parse(localStorage.getItem("lists"))
  listsFromStorage.map(list => {
    if(list.id === listID){
      list.notes.push(note);
      localStorage.setItem("lists", JSON.stringify(listsFromStorage));
      
    }
  })
}

function displayList(e) {
  if (e.target.classList.contains("list_link")) {
    let listID = e.target.id;
    var a = window.location.pathname;
    
    sideMenu.style.display = "none";
    addListContainer.style.display = "none";
    content.style.display = "block";

    displayClearAll();
    location.replace(`${a}?list=${listID}`);
  }
}

function displayStorage(listID) {
  content.style.display = "block";
  if (localStorage.lists) {
    let lists = JSON.parse(localStorage.getItem("lists"));
    lists.map((list) => {
      if (list.id === listID) {
        displayItemsTitle.innerHTML = `${list.name}`;
      }
    });
    refreshList(listID);
  } else {
    let lists = JSON.parse(localStorage.getItem("lists"));
    let lastList = lists[lists.length - 1];
    let listName = lastList.name;
    displayItemsTitle.innerHTML = `${listName}`;
    emptyList.style.display = "block";
  }
}

function displayClearAll() {

  if(list.childNodes.length != 0)
    clearAll.style.display = "block";
  else
    clearAll.style.display = "none";

}

function removeItems() {
  if (event.target.classList.contains("yes")) {
    let listID = getListIdFromUrl();
    let listsFromStorage = JSON.parse(localStorage.getItem("lists"));
    listsFromStorage.map(list =>
    {
      let notes = list.notes;
      notes.map(note =>{
        let noteID = note.id
        deleteNote(noteID)
      }
        )
    })
    console.log(listID, listsFromStorage);
    listsFromStorage.forEach(list => {
      
      
      if(list.id === listID){
        let notes = list.notes;
        console.log(notes);
        list.notes = [];
      }
      localStorage.setItem("lists", JSON.stringify(listsFromStorage));
      
    })
    let items = document.querySelectorAll(".grocery-item");
    items.forEach(function (element) {
      list.removeChild(element);
    });

    modal.style.display = "none";
    emptyList.style.display = "inline-block";
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
    list.removeChild(groceryItem);
    
    // deleteNote(noteID);
    removeSingleFromStorage(noteID);
  }
}

function removeSingleFromStorage(noteID) {
  let lists = JSON.parse(localStorage.getItem("lists"));
  let listID = getListIdFromUrl();
  lists.map(list => {
    if (listID === list.id){
      let notes = list.notes
        notes.find(function(note){
          if (note.id === noteID){
            let index = notes.indexOf(note)
            notes.splice(index, 1)
            localStorage.setItem("lists", JSON.stringify(lists));
          }
        })
    }
  })
  

  
  if (list.childNodes.length = 0) {
    emptyList.style.display = "inline-block";
  }
}

// function editItem() {
//   event.preventDefault();
//   let link = event.target.parentElement;
//   let text = link.parentElement.firstElementChild.innerHTML;
//   let textOld = link.parentElement.firstElementChild.nextElementSibling.value;
//   let groceryItem = event.target.parentElement.parentElement.parentElement;
//   let groceryItemTitle =
//     event.target.parentElement.previousElementSibling.previousElementSibling;
//   let saveEdit = event.target.nextElementSibling;
//   if (event.target.classList.contains("grocery-item-edit")) {
//     let editable = document.createAttribute("contenteditable");
//     editable.value = "true";
//     groceryItemTitle.setAttributeNode(editable);
//     groceryItemTitle.focus();
//     setEndOfContenteditable(groceryItemTitle);

//     event.target.style.display = "none";
//     event.target.nextElementSibling.style.display = "inline-block";
//   }
//   if (event.target.classList.contains("grocery-item-save")) {
//     console.log(text);
//     console.log(textOld);
//     editInStorage(text, textOld);

//     event.target.style.display = "none";
//     event.target.previousElementSibling.style.display = "inline-block";
//     groceryItemTitle.removeAttribute("contenteditable");
//   }
// }

function setEndOfContenteditable(contentEditableElement) {
  var range, selection;
  if (document.createRange) {
    //Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange(); //Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection(); //get the selection object (allows you to change selection)
    selection.removeAllRanges(); //remove any selections already made
    selection.addRange(range); //make the range you have just created the visible selection
  } else if (document.selection) {
    //IE 8 and lower
    range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
    range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    range.select(); //Select the range (make it the visible selection
  }
}

function editInStorage(item, textOld) {
  let groceryItems = JSON.parse(localStorage.getItem("groceryList"));
  let index = groceryItems.indexOf(textOld);
  groceryItems[index] = item;
  localStorage.setItem("groceryList", JSON.stringify(groceryItems));
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
    let textOld = event.target.nextElementSibling.value;
    save.style.display = "none";
    edit.style.display = "inline-block";

    editInStorage(text, textOld);
    event.target.removeAttribute("contenteditable");
  }
}
