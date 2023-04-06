// console.log("Hello world from app.js");

//storage
class Storage {
  static setTodayActionsToStorage(arr) {
    const todayDate = whatDayIsToday(); //remember to change back
    // const todayDate = "2023 April 7";
    localStorage.setItem(todayDate, JSON.stringify(arr));
  }
  static getTodayActionsFromStorage() {
    const todayDate = whatDayIsToday();
    let storage =
      localStorage.getItem(todayDate) === null
        ? []
        : JSON.parse(localStorage.getItem(todayDate));
    // let storage = []; //use this to setup and remember to change back
    return storage;
  }
}

//variables to use
let todayActions = Storage.getTodayActionsFromStorage();
let today = {};
today = {};
let history = {};
const translateActionsValueTo = {
  others: "Others",
  donothing: "Do Nothing",
  game: "Game",
  socialmedia: "Social Media",
  dailyactivities: "Daily Activities",
};

// select html elements
const getInputForm = document.querySelector("[data-getInputForm]");
const addMinutesButtons = document.querySelectorAll(".btn");
const minutesCount = document.querySelector("#minutesCount");
const activityRadioButtons = document.querySelectorAll('[name="Activity"]');
const todayDateIs = document.querySelector("#todayDateIs");
const todayActivitiesContainer = document.getElementById(
  "activitiesListContainer"
);
const showTotalMinutesToday = document.getElementById("showTotalMinutesToday");
const radioButtonsNamedOthers = document.querySelector("[value='others']");

//action and its information etc...
class Action {
  constructor(minutes, activity, todayIs, timeIs) {
    this.minutes = minutes;
    this.activity = activity;
    this.todayIs = todayIs;
    this.timeIs = timeIs;
  }
  pushToTodayActions() {
    todayActions.push(this);
    console.log(todayActions);
  }
}

//event listener
class Event {
  static formSubmit() {
    getInputForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let getTodayDate = whatDayIsToday();
      let getTodayTime = whatTimeIsIt();
      let getMinutesCount = Number(minutesCount.textContent);
      if (getMinutesCount === 0) return;
      let getActivity;
      activityRadioButtons.forEach((action) => {
        if (action.checked) getActivity = translateActionsValueTo[action.value];
      });
      UI.updateSpecificActivityTotalMinutes(getActivity, getMinutesCount);
      let newAction = new Action(
        getMinutesCount,
        getActivity,
        getTodayDate,
        getTodayTime
      );
      newAction.pushToTodayActions();
      Storage.setTodayActionsToStorage(todayActions);
      UI.callAllUIMethodsOnce();
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
      UI.callAllUIMethodsOnce();
    });
  }
  static callAllEventListenerMethods() {
    Event.showTodayWhenDOMLoaded();
    Event.formSubmit();
    Event.addMinutesClick();
  }
}

//change UI
class UI {
  static showTodayActivitiesList() {
    let html;
    if (todayActions.length >= 1) {
      //if length > 1
      html = todayActions
        .map((action, index) => {
          if (index === 0) {
            //then first element don't have <hr> on top
            return `<li class="activityItem">
            <p class="itemTodayActivityTimeIs">${action.timeIs}</p>
            <div class="activityAndMinutesContainer">
            <p class="itemTodayActivity">${action.activity}</p>
            <p class="itemTodayMinutes">${action.minutes}</p>
            </div>
            </li>`;
          }
          //every other elements have <hr> on top
          return `<li class="activityItem">
            <hr/>
            <p class="itemTodayActivityTimeIs">${action.timeIs}</p>
            <div class="activityAndMinutesContainer">
            <p class="itemTodayActivity">${action.activity}</p>
            <p class="itemTodayMinutes">${action.minutes}</p>
            </div>
            </li>`;
        })
        .join(" ");
    }
    if (todayActions.length === 0) {
      //if length = 0 then show default html
      html = `<li class="activityItem">
      <p class="itemTodayActivityTimeIs">00:00</p>
      <div class="activityAndMinutesContainer">
        <p class="itemTodayActivity">Others</p>
        <p class="itemTodayMinutes">0</p>
      </div>
    </li>`;
    }
    todayActivitiesContainer.innerHTML = html;
  }
  static showTotalMinutesToday() {
    let totalMinutes = 0;
    todayActions.forEach((action) => {
      totalMinutes += action.minutes;
    });
    showTotalMinutesToday.innerHTML = totalMinutes;
  }
  static resetInputFormToDefault() {
    minutesCount.innerHTML = "0";
    radioButtonsNamedOthers.checked = true;
  }
  static updateSpecificActivityTotalMinutes(activity, minutes) {
    const stringConvert = activity.split(" ").join("");
    const idOfThatSpecificActivity = `totalFor${stringConvert}`;
    console.log(idOfThatSpecificActivity);
    const element = document.getElementById(idOfThatSpecificActivity);
    const elementInnerHTMLNumber = Number(element.innerHTML) + minutes;
    element.innerHTML = elementInnerHTMLNumber;
  }
  static callAllUIMethodsOnce() {
    UI.showTodayActivitiesList();
    UI.showTotalMinutesToday();
    UI.resetInputFormToDefault();
  }
}

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
function groupByDate() {}

//call methods
Event.callAllEventListenerMethods();
// UI.callAllUIMethodsOnce();
