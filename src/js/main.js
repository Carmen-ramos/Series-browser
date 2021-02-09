"use strict";
const inputEl = document.querySelector(".js-input");
const buttonEl = document.querySelector(".js-button");
//const apiurl = 'http://api.tvmaze.com/search/shows?q='
const ulShowList = document.querySelector(".js-showList");
const ulFavList = document.querySelector(".js-favList");
let showsList = [];
let favoritesList = [];

function getApiData() {
  getFromLocalStorage();
  const inputValue = inputEl.value;
  fetch(`http://api.tvmaze.com/search/shows?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      showsList = [];
      for (let i = 0; i < data.length; i++) {
        showsList.push(data[i].show);
      }
      paintList();
    });
}
buttonEl.addEventListener("click", getApiData);

// form preventDefault
const formElement = document.querySelector(".js-form");
function handleForm(ev) {
  ev.preventDefault();
}
formElement.addEventListener("submit", handleForm);

// Image default for shows without image.
let imgDefault = "././assets/images/tvSeries.jpg";

// paint
function paintList() {
  let html = "";
  for (const item of showsList) {
    let favClass; //meter en una funcion mejor?
    if (isShowFav(item)) {
      favClass = "favourite";
    } else {
      favClass = "";
    }
    html += `<li class = "js-shows ${favClass}" id=${item.id}>`;
    html += `<h2 class="shows__title">${item.name}</h2>`;
    if (item.image === null) {
      html += `<img src= ${imgDefault} class= "imgDefault">`;
    } else {
      html += `<img src= ${item.image.medium}>`;
    }

    html += "</li>";
  }
  ulShowList.innerHTML = html;
  paintFavList();
  listenShowsEvents();
}

//favourite or not  // REVISAR VIDEO PARA ENTENDER.
function isShowFav(item) {
  const favoriteFound = favoritesList.find((favorite) => {
    return favorite.id === item.id;
  });
  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}

//listen cards shows events // cambiar el show por Card????
function listenShowsEvents() {
  const showElements = document.querySelectorAll(".js-shows");
  for (const showElement of showElements) {
    showElement.addEventListener("click", handleShow);
  }
}
// handle
function handleShow(ev) {
  const clickedShowID = parseInt(ev.currentTarget.id);
  //buscar el contenido del elemento clickado.
  const showObjClicked = showsList.find((item) => {
    return item.id === clickedShowID;
  });
  // favoritesFound me va a dar si el elemento clickado esta en fav o no. Sino se encuentra nos devueve -1
  const favoritesFound = favoritesList.findIndex((pepino) => {
    return pepino.id === clickedShowID;
  });

  if (favoritesFound === -1) {
    favoritesList.push(showObjClicked);
  } else {
    favoritesList.splice(favoritesFound, 1);
  }

  setInLocalStorage();
  paintFavList();
}

function paintFavList() {
  let html = "";
  for (const item of favoritesList) {
    html += `<li class = "js-shows" id=${item.id}>`;
    html += `<h2 class="shows__title">${item.name}</h2>`;
    if (item.image === null) {
      html += `<img src= ${imgDefault} class= "imgDefault">`;
    } else {
      html += `<img src= ${item.image.medium}>`;
    }
    html += "<button class ='js-delete' >Borrar</button>";
    html += "</li>";
  }
  ulFavList.innerHTML = html;
  handleDelete();
  // listenShowsEvents();
}

const deleteButtonFav = document.querySelector(".js-delete");
function handleDelete() {
  console.log("me quieren borrar");
}
deleteButtonFav.addEventListener("click", handleDelete);

function setInLocalStorage() {
  localStorage.setItem("listFavLocal", JSON.stringify(favoritesList));
}

function getFromLocalStorage() {
  const localStorageFavList = localStorage.getItem("listFavLocal");
  if (localStorageFavList !== null) {
    favoritesList = JSON.parse(localStorageFavList);
    paintFavList();
  }
}
/*
function paintFavList() {
  let htmlCode = "";
  console.log(htmlCode);
  ulFavList.innerHTML = htmlCode;
}*/

getFromLocalStorage();
//getApiData();
//handleForm();
//handleShow();
