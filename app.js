import Api from "./api.js";

let user = document.cookie;
console.log("u", user);
if (!user) {
  user = prompt(
    "Пользователь не найден, укажите имя пользователя",
    "<Siyalov>"
  );
  document.cookie = `user=${user}`;
} else {
  user = user.split("=")[1];
}

const api = new Api(user);

const container = document.querySelector(".container");
const btn = document.querySelector(".dashboard").firstElementChild;
const popupList = document.querySelectorAll(".popup");
const popBox = document.querySelector(".popup-wrapper");

let catsList = localStorage.getItem("cats");
if (catsList) {
  catsList = JSON.parse(catsList);
}
console.log(catsList);

const addForm = document.forms.add;
addForm.addEventListener("submit", function (e) {
  addCat(e, api, Array.from(popupList), catsList);
});

if (!catsList) {
  api
    .getCats()
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.message === "ok") {
        localStorage.setItem("cats", JSON.stringify(data.data));

        data.data.forEach((cat) => {
          createCard(cat, container, Array.from(popupList));
        });
      } else {
        showPopup(Array.from(popupList), "info", data.message);
      }
    });
} else {
  catsList.forEach((cat) => {
    createCard(cat, container, Array.from(popupList));
  });
}

popupList.forEach((p) => {
  p.firstElementChild.addEventListener("click", (e) => {
    p.classList.remove("active");
    popBox.classList.remove("active");
  });
});

btn.addEventListener("click", (e) => {
  showPopup(Array.from(popupList), "add");
});

popBox.addEventListener("click", function (e) {
  if (e.target === this) {
    popBox.classList.remove("active");
    popupList.forEach((p) => {
      if (p.classList.contains("active")) {
        p.classList.remove("active");
      }
    });
  }
});
