// console.log("Hello world from app.js");

//variables to use
let todayActions = [];
let today = {};
let history = {};

// select html elements
const submitBtn = document.getElementById("submit-button");
const form = document.querySelector("[data-form]");
const buttons = document.querySelectorAll(".btn");
const time = document.querySelector("#time");
const actions = document.querySelectorAll('[name="Action"]');

//action and its information etc...
class Action {
  constructor(minutes, activity, today) {
    this.minutes = minutes;
    this.activity = activity;
    this.today = today;
  }
}

//event listener
class Event {
  static form() {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      actions.forEach((action) => {
        if (action.checked) {
          let getTodayDate = getToday();
          todayActions.push(
            new Action(Number(time.textContent), action.value, getTodayDate)
          );
        }
      });
      console.log(todayActions);
    });
  }
  static addMinutes() {
    buttons.forEach((button) => {
      button.addEventListener("mousedown", (e) => {
        let timeValue = Number(time.textContent);
        let addValue = Number(e.target.textContent);
        time.innerHTML = timeValue + addValue;
      });
    });
  }
}

//change UI
class UI {}

//storage
class Storage {}

//functions for  hoisting
function getToday() {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let month = date.getMonth();
  month = months[month];
  let day = date.getDate();
  let year = date.getFullYear();
  return `${hours}:${minutes} - ${year} ${month} ${day}`;
}

//call methods
Event.form();
Event.addMinutes();
