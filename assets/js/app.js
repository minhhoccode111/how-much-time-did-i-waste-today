// console.log("Hello world from app.js");

//variables to use
let todayActions = [];
let today = {};
today = {};
let history = {};

// select html elements
const getInputForm = document.querySelector("[data-getInputForm]");
const addMinutesButtons = document.querySelectorAll(".btn");
const minutesCount = document.querySelector("#minutesCount");
const activityRadioButtons = document.querySelectorAll('[name="Activity"]');
const todayDateIs = document.querySelector("#todayDateIs");

//action and its information etc...
class Action {
  constructor(minutes, activity, todayIs, timeIs) {
    this.minutes = minutes;
    this.activity = activity;
    this.todayIs = todayIs;
    this.timeIs = timeIs;
  }
}

//event listener
class Event {
  static formSubmit() {
    getInputForm.addEventListener("submit", (e) => {
      e.preventDefault();
      activityRadioButtons.forEach((action) => {
        if (action.checked) {
          let getTodayDate = whatDayIsToday();
          let getTodayTime = whatTimeIsIt();
          let getActivity = action.value;
          let getMinutesCount = Number(minutesCount.textContent);
          let newAction = new Action(
            getMinutesCount,
            getActivity,
            getTodayDate,
            getTodayTime
          );
          todayActions.push(newAction);
        }
      });
      console.log(todayActions);
    });
  }
  static addMinutesClick() {
    addMinutesButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        let currentMinutes = Number(minutesCount.textContent);
        let addUpValue = Number(e.target.textContent);
        minutesCount.innerHTML = currentMinutes + addUpValue;
      });
    });
  }
  static showTodayWhenDOMLoaded() {
    window.addEventListener("DOMContentLoaded", () => {
      todayDateIs.innerHTML = whatDayIsToday();
    });
  }
}

//change UI
class UI {}

//storage
class Storage {}

//functions for  hoisting
function whatDayIsToday() {
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
  let month = date.getMonth();
  month = months[month];
  let day = date.getDate();
  let year = date.getFullYear();
  return `${year} ${month} ${day}`;
}
function whatTimeIsIt() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  return `${hours}:${minutes}`;
}

//call methods
Event.formSubmit();
Event.addMinutesClick();
Event.showTodayWhenDOMLoaded();
