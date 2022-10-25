const createCard = (data, parent, arr) => {
  const card = document.createElement("div");
  card.className = "card";
  //card.setAttribute("data-id", data.id);
  card.dataset.id = data.id;

  const age = document.createElement("div");
  age.className = "age";
  age.innerText = data.age || "no";

  const rate = document.createElement("div");
  rate.className = "rate";
  rate.innerHTML =
    "<span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>";

  const pic = document.createElement("div");
  pic.className = "pic";
  pic.style.backgroundImage = `url(${data.img_link || "images/cat.jpeg"})`;

  const name = document.createElement("div");
  name.className = "name";
  name.innerHTML = data.name;

  card.append(pic, age, rate, name);
  card.addEventListener("click", function () {
    const popup = showPopup(arr, "card");
    popup.innerHTML = `<div class="controls"><button name="delete">УДАЛИТЬ</button><button name="edit">РЕДАКТИРОВАТЬ</button></div> 
    <div class="card">
    <div class="pic big-pic" style = "background-image:url(${
      data.img_link || "images/cat.jfif"
    })"></div>
    <div class="age">${data.age}</div>
    <div class="rate">
      <span>☆</span>
      <span>☆</span>
      <span>☆</span>
      <span>☆</span>
      <span>☆</span>
    </div>
    <div class="name">${data.name}</div>
    <div class="description" >${data.description} </div>
    
    
  </div>
  `;
    const del = popup.querySelector("[name='delete']");
    const edit = popup.querySelector("[name='edit']");
    del.addEventListener("click", function () {
      api
        .delCat(data.id)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.message === "ok") {
            // store.push(body);
            // localStorage.setItem("cats", JSON.stringify(store));
            document.querySelector(".popup-wrapper").classList.remove("active");
            localStorage.removeItem("cats");
            location.reload();
          }
          //showPopup(popupList, "info", data.message);
        });
    });
  });
  parent.append(card);
};

const showPopup = (list, type, content) => {
  let el = list.filter((el) => el.dataset.type === type)[0];
  //   switch (type) {
  //     case "card":
  //     case "info":
  //     case "form":
  //   }

  el.classList.add("active");
  el.parentElement.classList.add("active");
  return el;
};

const addCat = (e, api, popupList, store) => {
  e.preventDefault();
  // let api = window.api || [];
  // let popupList = Array.window.popupList || [];
  let body = {}; // {name: 'Vasya', id;}
  for (let i = 0; i < e.target.elements.length; i++) {
    let el = e.target.elements[i];
    //console.log(el);
    if (el.type === "checkbox") {
      body[el.name] = el.checked;
    } else if (el.value) {
      body[el.name] = el.value;
    }
  }

  console.log(body);
  api
    .addCat(body)
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "ok") {
        createCard(body, document.querySelector(".container"));
        store.push(body);
        localStorage.setItem("cats", JSON.stringify(store));
        e.target.reset();
        document.querySelector(".popup-wrapper").classList.remove("active");
      }
      //showPopup(popupList, "info", data.message);
    });
};
