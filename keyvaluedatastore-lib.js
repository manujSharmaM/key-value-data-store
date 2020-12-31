const fs = require("fs");

//Class keyValueDataStore
var keyValueDataStore = class keyValueDataStore {
  //Constructor
  constructor(path = "./datastore.txt") {
    //Instance Variable
    this.key = "";
    this.value = null;
    this.time_to_live = 0;
    this.path = path;

    //JSON model
    this.valueobj = { value: this.value, time_to_live: this.time_to_live };
  }

  getJSON() {
    let rawdata = fs.readFileSync(this.path);
    let jsonArr = JSON.parse(rawdata);
    return jsonArr;
  }

  checkJSON(key) {
    var jsonobj = this.getJSON();
    var flag = false;
    jsonobj.forEach((element) => {
      if (element[key] != null) {
        flag = true;
      }
    });
    return flag;
  }

  getItem(key) {
    var jsonArr = this.getJSON();
    var obj = {};

    for (var x in jsonArr) {
      if (Object.keys(jsonArr[x])[0] == key) {
        obj = jsonArr[x];
      }
    }
    return obj;
  }

  setItem(key, value, time_to_live) {
    let jsonArr = this.getJSON();

    var jsonKey = key;
    var obj = {};
    obj[jsonKey] = { value: value, time_to_live: time_to_live };

    jsonArr.push(obj);
    let data = JSON.stringify(jsonArr, null, 2);
    fs.writeFileSync(this.path, data);
    console.log("Data Successfully Written");
  }

  removeItem(key) {
    var jsonArr = this.getJSON();
    var index = jsonArr.indexOf(key);
    if (index > -1) {
      jsonArr.splice(index, 1);
    }
  }

  createFile(filePath) {
    const content = "[]";
    fs.writeFileSync(filePath, content, (err) => {
      if (err) {
        console.log("An err occured" + err);
      } else {
        console.log("file is made");
      }
    });
  }

  checkTime(key) {
    var millis = Date.now();
    var currentTime = Math.floor(millis / 1000);
    var jsonobj = this.getItem(key);
    var time = jsonobj[key]["time_to_live"];
    if (currentTime > time) {
      return true;
    } else {
      return false;
    }
  }

  //Create Method
  // * Creates key-value pair in local storage.

  create(key, value, time_to_live = 0) {
    //Check file is present or not
    if (!fs.existsSync(this.path)) {
      this.createFile(this.path);
    }

    this.key = key;
    this.value = value;
    this.time_to_live = time_to_live;

    //Calculate Time
    var millis = Date.now();
    this.time_to_live = Math.floor(millis / 1000) + this.time_to_live;
    this.valueobj = { value: this.value, time_to_live: this.time_to_live };

    //Size of value Object
    var size = Buffer.byteLength(JSON.stringify(this.valueobj));
    var sizeInKB = size / 1024;

    //Size of the storage
    var stats = fs.statSync(this.path);
    var fileSize = stats.size;
    var fileSizeInGB = fileSize / (1024 * 1024 * 1024);

    // Error Handling
    if (key.length > 32) {
      console.log("Key is greater than 32 character long.");
    } else if (sizeInKB > 16) {
      console.log("Size of json object exceeds 16KB");
    } else if (fileSizeInGB == 1) {
      console.log("Size of Storage exceeded 1 GB.Cannot store anymore");
    } else if (this.checkJSON(this.key)) {
      console.log("Key already exists  in local Storage");
    } else {
      this.setItem(this.key, this.value, this.time_to_live);
      console.log(
        "Success! Key: " +
          this.key +
          ", value: " +
          this.value +
          " is added" +
          "\nTime to live: " +
          this.time_to_live
      );
    }
  }

  //Read Method
  // * Read and returns Key-Value Pair In Local Storage.

  read(key) {
    if (!this.checkJSON(key)) {
      console.log("Key Doesn't Exist in local Storage");
    } else {
      if (this.checkTime(key)) {
        return "Time Expired to read the data";
      } else {
        this.valueobj = jsonobj.key;
        return this.valueobj;
      }
    }
  }

  //Delete Method
  // *Delete Key-Value Pair In Local Storage.
  delete(key) {
    //Error Handling
    if (!this.checkJSON(key)) {
      console.log("Key Doesn't exist in local storage");
    } else {
      if (this.checkTime(key)) {
        console.log("Time Expired to delete the data");
      } else {
        var deleted_value = this.getItem(key);
        var removedObj = this.removeItem(key);
        let data = JSON.stringify(removedObj, null, 2);
        fs.writeFileSync(this.path, data);
        console.log(
          "Success! Key: " + key + ", value: " + deleted_value + " is deleted"
        );
      }
    }
  }
};
module.exports = keyValueDataStore;
