const addFirstListLabel = document.querySelector(".add_first_list");
const sideMenu = document.querySelector(".side_menu");
const displayItemsCont = document.querySelector(".display-items-container");
const addItemsCont = document.querySelector(".add-items-container");
const addListContainer = document.querySelector(".add-list-container");
const close = document.querySelector(".close");
const sideMenuAdd = document.querySelector(".side_menu_add");
const firstListBtn = document.querySelector(".first_list_btn");
const bars = document.querySelector(".bars");
const plus = document.querySelector(".plus");
const clearAll = document.querySelector(".clear-button");
const content = document.querySelector(".content");
const displayItemsTitle = document.querySelector(".display-items-title");
const displayItemsList = document.querySelector(".display-items-list");
const yourLists = document.querySelector(".your_lists");

close.addEventListener("click", closeAdding);
sideMenuAdd.addEventListener("click", showListAdding);
firstListBtn.addEventListener("click", showListAdding);
bars.addEventListener("click", toggleMenu);
sideMenu.addEventListener("click", displayList);
plus.addEventListener("click", showAdding);


function showListAdding(e) {
  e.preventDefault();
  setCssDisplayProperty([sideMenu, addFirstListLabel, displayItemsCont, addItemsCont], "none");
  setCssDisplayProperty([addListContainer], "inline-block");
  inputTextList.value = "";
}

function showNotesAddUI(){
  setCssDisplayProperty([content], "block");
  setCssDisplayProperty([displayItemsCont, addItemsCont], "flex");
  setCssDisplayProperty([addListContainer], "none");
}

function closeAdding() {
  addItemsCont.style.display = "none";
  close.style.display = "none";
}

function markNoteAsTemp(elementId){
  let tempNoteUI = document.getElementById(elementId);
  tempNoteUI.lastElementChild.classList.add("showAsterisk")
}

function unmarkNoteAsTemp(id){
  let noteUI = document.getElementById(id);
  noteUI.lastElementChild.classList.remove("showAsterisk")
}

function replaceTempListDOM(tempListID, newId){
let tempListUI = displayItemsCont.firstElementChild.nextElementSibling;
if (tempListUI.id == tempListID){
  tempListUI.firstElementChild.nextElementSibling.classList.remove("showAsterisk");
  displayItemsTitle.id = newId;
}

}

function displayListName(listID, element){
  let lists = getListsFromStorage();
  lists.map((list) => {
    if (list.id == listID) {
      element.firstElementChild.innerHTML = `${list.name}`;
      element.id = list.id;
      if (typeof list.id === "number") {
          markListAsTemp(element);
      }
    }
  });
}

function markListAsTemp(element){
  element.firstElementChild.nextElementSibling.classList.add("showAsterisk");
}

function showListView(listID){
  let lists = getListsFromStorage();
  if (!lists) {
    addFirstListLabel.style.display = "inline-block";
  } 
  else {
    displayStorage(listID);
  }
}

function showSideMenuView(){
  sideMenu.style.display = "flex";
  if(yourLists.childElementCount < 1){
    yourLists.innerHTML = `<li class="no_lists_message">
    <p>No lists added</p>
    </li>`
  }
}

function setCssDisplayProperty(elements, displayOption){
  for (const element of elements){
    element.style.display = displayOption;
  }
    
}

function showAdding() {
  addItemsCont.style.display = "block";
  close.style.display = "block";
  input.focus();
  addFirstItem.style.display = "none";
  plus.style.animationName = "none";
}

function toggleMenu() {
  if (sideMenu.style.display === "none" || sideMenu.style.display === "") {
    sideMenu.style.display = "flex";
  } else {
    sideMenu.style.display = "none";
  }
}

function setListView(){
  addListContainer.style.display = "none";
  sideMenu.style.display = "none";
  content.style.display = "block";
}

function displayList(e) {
  if (e.target.classList.contains("list_link") ||e.target.parentElement.classList.contains("list_link")) {
    if(e.target.id)
      location.replace(`${window.location.pathname}?list=${e.target.id}`);
    // setListView();     
    // if (localStorage.tempLists && listID.length < 10) {
    //   displayStorage(listID)
    // }
    //  else {
    //   location.replace(`${window.location.pathname}?list=${listID}`);
    // }
  }
}

function displayStorage(listID) {
  content.style.display = "block";
  displayListName(listID, displayItemsTitle);
  let notes = getNotesFromList(listID); 
  addNotesToInterface(notes);
  markTempNotes(notes);

    // if (localStorage.tempLists) {
    //   listDOM.innerHTML = "";
    //   listsFromStorage.find((list) => {
    //     if (list.id == listID) {
    //       list.notes.map((note) => {
    //         AddNoteToInterface(note.value, note.id);
    //         displayItemsTitle.innerHTML = `${list.name}`;
    //         document.getElementById(`${note.id}`).style.opacity = "0.5";
    //       });
    //     }
    //   });
    // }

    // if (localStorage.tempNotes || localStorage.tempLists) {
    //   lists.find((list) => {
    //     if (list.id === listID) {
    //       list.notes.map((note) => {
    //         AddNoteToInterface(note.value, note.id);
    //         if (typeof note.id === "number") {
    //           document.getElementById(`${note.id}`).style.opacity = "0.5";
    //         }
    //       });
    //     }
    //   });
    // } else refreshList(listID);
  
  displayClearAll();
}

function markTempNotes(notes){
notes.forEach(note => {
  if(typeof note.id == "number" ){
    markNoteAsTemp(note.id)
  }
})
}

function displayClearAll() {
  if (displayItemsList.childNodes.length != 0) {
    clearAll.style.display = "block";
    emptyList.style.display = "none";
  } else {
    clearAll.style.display = "none";
    emptyList.style.display = "block";
  }
}

function addNotesToInterface(notes) {
  notes.forEach(note => {
    addNoteToInterface(note);
  });
  displayClearAll();
}

function addNoteToInterface(note){
  let div = document.createElement("div");
  div.classList.add("grocery-item");
  div.innerHTML = generateNoteHtml(note.value, note.id);
  listDOM.appendChild(div);
  displayClearAll();
}

function removeListFromMenu(trashIcon){
  let lists = trashIcon.parentElement.parentElement;
  let listToDelete = trashIcon.parentElement;
  lists.removeChild(listToDelete);
  return listToDelete.id
}

function addListToMenu(list) {
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

function addListsToMenu() {
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

function getListFromDom(){
  return displayItemsTitle.id;
}