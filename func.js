const createCard = (data, parent, arr, api) => {
  const card = document.createElement("div");
  card.className = "card";

  card.dataset.id = data.id;

  const age = document.createElement("div");
  age.className = "age";
  age.innerText = data.age || "no";

  const rate = document.createElement("div");
  rate.className = "rate";
  rate.innerHTML =
    "<span>★</span>".repeat(Math.max(Math.min(data.rate, 5), 0)) +
    "<span>☆</span>".repeat(Math.max(Math.min(5 - data.rate, 5), 0));

  const pic = document.createElement("div");
  pic.className = "pic";
  pic.style.backgroundImage = `url(${data.img_link || "images/cat.jpeg"})`;

  const name = document.createElement("div");
  name.className = "name";
  name.innerHTML = data.name;

  card.append(pic, age, rate, name);
  card.addEventListener("click", function () {
    const popup = showPopup(arr, "card");
    popup.innerHTML = `
    <div class="close">+</div>
    <div class="container_preview">
      <div class="controls">
        <button name="delete">УДАЛИТЬ</button>
        <button name="edit">РЕДАКТИРОВАТЬ</button>
      </div> 
      <div class="card">
        <div class="pic big-pic" style = "background-image:url(${
          data.img_link || "images/cat.jpeg"
        })"></div>
        <div class="age">${data.age}</div>
        <div class="rate">
        ${
          "<span>★</span>".repeat(Math.max(Math.min(data.rate, 5), 0)) +
          "<span>☆</span>".repeat(Math.max(Math.min(5 - data.rate, 5), 0))
        }
        </div>
        <div class="name">${data.name}</div>
        <div class="description" >${data.description}</div>        
      </div>
    </div>
  `;
    const del = popup.querySelector("[name='delete']");
    const close = popup.querySelector(".close");
    const edit = popup.querySelector("[name='edit']");

    close.addEventListener("click", () => {
      popup.classList.remove("active");
      popup.parentElement.classList.remove("active");
    });

    del.addEventListener("click", function () {
      api
        .delCat(data.id)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.message === "ok") {
            document.querySelector(".popup-wrapper").classList.remove("active");
            localStorage.removeItem("cats");
            location.reload();
          }
        });
    });

    edit.addEventListener("click", (e) => {
      popup.classList.remove("active");
      const add = showPopup(arr, "add");
      add.classList.remove("add-new");
      add.classList.add("add-edit");

      const name = add.querySelector("input[name='name']");
      const img_link = add.querySelector("input[name='img_link']");
      const id = add.querySelector("input[name='id']");
      const age = add.querySelector("input[name='age']");
      const rate = add.querySelector("input[name='rate']");
      const favourite = add.querySelector("input[name='favourite']");
      const description = add.querySelector("[name='description']");

      id.disabled = true;

      name.value = data.name || "";
      img_link.value = data.img_link || "";
      id.value = data.id;
      age.value = data.age || 0;
      rate.value = data.rate;
      favourite.checked = data.favourite || false;
      description.value = data.description || "";
    });
  });
  parent.append(card);
};

const showPopup = (list, type, content) => {
  let el = list.filter((el) => el.dataset.type === type)[0];

  el.classList.add("active");
  el.parentElement.classList.add("active");
  return el;
};

const addCat = (e, api, popupList, store) => {
  e.preventDefault();

  let body = {}; // {name: 'Vasya', id;}
  for (let i = 0; i < e.target.elements.length; i++) {
    let el = e.target.elements[i];
    console.log(el);
    if (el.type === "checkbox") {
      body[el.name] = el.checked;
    } else if (el.value) {
      body[el.name] = el.value;
    }
  }

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
    });
};

const editCat = (e, api, popupList, store) => {
  e.preventDefault();

  let body = {}; // {name: 'Vasya', id;}
  for (let i = 0; i < e.target.elements.length; i++) {
    let el = e.target.elements[i];
    console.log(el);
    if (el.type === "checkbox") {
      body[el.name] = el.checked;
    } else {
      body[el.name] = el.value;
    }
  }

  console.log(body);
  const id = body.id;
  body.id = undefined;
  api
    .uppCat(id, body)
    .then((res) => res.json())
    .then((data) => {
      if (data.message === "ok") {
        localStorage.removeItem("cats");
        location.reload();
      }
    });
};
