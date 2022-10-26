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
  const add = Array.from(popupList).filter((e) => e.dataset.type == "add")[0];
  if (add.classList.contains("add-new")) {
    addCat(e, api, Array.from(popupList), catsList);
  } else {
    editCat(e, api, Array.from(popupList), catsList);
  }
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
          createCard(cat, container, Array.from(popupList), api);
        });
      } else {
        showPopup(Array.from(popupList), "info", data.message);
      }
    });
} else {
  catsList.forEach((cat) => {
    createCard(cat, container, Array.from(popupList), api);
  });
}

popupList.forEach((p) => {
  p.firstElementChild.addEventListener("click", (e) => {
    p.classList.remove("active");
    popBox.classList.remove("active");
  });
});

btn.addEventListener("click", (e) => {
  const addForm = document.forms.add;
  addForm.reset();
  const id = addForm.querySelector('[name="id"]');
  id.disabled = false;
  const add = showPopup(Array.from(popupList), "add");
  add.classList.add("add-new");
  add.classList.remove("add-edit");
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
