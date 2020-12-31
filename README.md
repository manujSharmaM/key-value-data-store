# key-value-data-store

## Introduction

To build a file-based key-value data store that supports the basic CRD operations.

## Setup

To run this project ,install it locally using npm:

  npm init
  node unit-testing.js

## How to use this library

create a js file and import the keyvaluedatastore.lib
...
const datastore = require("./keyvaluedatastore-lib")

Use this if you dont want to create file path
const store = new datastore();

Otherwise mention the file path like this for instance
const store = new datastore("./datastore.txt");
...

### After instanitating the class, You could use "store" for CRD operations as shown below 

To create a key-value in existing or new data store file
...
store.create("John", 15000, 60);
...

To Read a key-value from existing data store file
...
store.read("John");
...

To Delete a key from existing data store
...
store.delete("John");
...
