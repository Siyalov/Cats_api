// ООП
class Api {
  constructor(name) {
    this.name = name;
    this.path = "https://sb-cats.herokuapp.com/api/2/";
  }
  getCats() {
    return fetch(`${this.path}${this.name}/show`);
  }
  getCat(id) {
    return fetch(`${this.path}${this.name}/show/${id}`);
  }
  getTds() {
    return fetch(`${this.path}${this.name}/ids`);
  }
  addCat(body) {
    return fetch(`${this.path}${this.name}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  }
  uppCat(id, body) {
    return fetch(`${this.path}${this.name}/add`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  delCat(id, body) {
    return fetch(`${this.path}${this.name}/delete/${id}`, {
      method: "DELETE",
    });
  }
}

export default Api;
