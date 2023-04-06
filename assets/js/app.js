// console.log("Hello world from app.js");

//variables to use
let todayActions = [];
let today = {};
today = {};
let history = {};
const translateActionsValueTo = {
  others: "Others",
  donothing: "Do nothing",
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
  pushToTodayActionsAndShowList() {
    todayActions.push(this);
    UI.callAllUIMethodsOnce();
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
      let newAction = new Action(
        getMinutesCount,
        getActivity,
        getTodayDate,
        getTodayTime
      );
      newAction.pushToTodayActionsAndShowList();
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
  static callAllEventListenerMethods() {
    Event.formSubmit();
    Event.addMinutesClick();
    Event.showTodayWhenDOMLoaded();
  }
}

//change UI
class UI {
  static showTodayActivitiesList() {
    let html;
    if (todayActions.length > 1) {
      html = todayActions
        .map((action) => {
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
    if (todayActions.length === 1) {
      html = todayActions
        .map((action) => {
          return `<li class="activityItem">
        <p class="itemTodayActivityTimeIs">${action.timeIs}</p>
        <div class="activityAndMinutesContainer">
        <p class="itemTodayActivity">${action.activity}</p>
        <p class="itemTodayMinutes">${action.minutes}</p>
        </div>
        </li>`;
        })
        .join(" ");
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
  static callAllUIMethodsOnce() {
    UI.showTodayActivitiesList();
    UI.showTotalMinutesToday();
    UI.resetInputFormToDefault();
  }
}

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
Event.callAllEventListenerMethods();
// UI.callAllUIMethodsOnce();
