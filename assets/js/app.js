// console.log("Hello world from app.js");

//variables to use
let actions = [];

// select html elements
const submitBtn = document.getElementById("submit-button");
const form = document.querySelector("[data-form]");

//action and its information etc...
class Action {}

//event listener
class Event {
  static form() {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("submit");
    });
  }
}

//change UI
class UI {}

//storage
class Storage {}

//call methods
Event.form();
