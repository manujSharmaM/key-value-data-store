var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

class DataStorage {
  constructor() {}

  //methods
  create(key, value) {
    localStorage.setItem(key, value);
    console.log(localStorage.getItem(key));
  }

  read(key) {
    var readValue = localStorage.getItem(key);
    console.log(readValue);
  }

  delete(key) {
    var deleteValue = localStorage.removeItem(key);
  }
}

module.exports = DataStorage;
