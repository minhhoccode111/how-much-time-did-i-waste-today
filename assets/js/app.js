// console.log("Hello world from app.js");

//storage
class Storage {
  static setTodayActionsToStorage(arr) {
    const todayDate = whatDayIsToday(); //remember to change back
    // todayDate = "2023 April 7";
    localStorage.setItem(todayDate, JSON.stringify(arr));
    // localStorage.setItem(todayDate, JSON.stringify([])); //use this line to reset localStorage, remember to change back
  }
  static getTodayActionsFromStorage() {
    const todayDate = whatDayIsToday();
    let storage =
      localStorage.getItem(todayDate) === null
        ? []
        : JSON.parse(localStorage.getItem(todayDate));
    // storage = []; //use this line to reset localStorage, remember to change back
    return storage;
  }
  static setTodayActionsToStorageHistory(obj) {
    localStorage.setItem("storageHistory", JSON.stringify(obj));
  }
  static getTodayActionsFromStorageHistory() {
    let storage =
      localStorage.getItem("storageHistory") === null
        ? {}
        : JSON.parse(localStorage.getItem("storageHistory"));
    return storage;
  }
}

//variables to use
let todayActions = Storage.getTodayActionsFromStorage();
let history = Storage.getTodayActionsFromStorageHistory();
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
  pushToTodayActionsAndUpdateHistory() {
    todayActions.push(this);
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
      newAction.pushToTodayActionsAndUpdateHistory();
      Storage.setTodayActionsToStorage(todayActions);
      history = groupByDate(todayActions, "todayIs");
      Storage.setTodayActionsToStorageHistory(history);
      UI.callAllUIMethodsOnce();
      UI.updateEveryActivityTotalMinutes(); //FIXME
      console.log(history);
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
      UI.updateEveryActivityTotalMinutes();
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
  static updateEveryActivityTotalMinutes() {
    todayActions.forEach((action) => {
      const stringConvert = action["activity"].split(" ").join("");
      const idOfThatSpecificActivity = `totalFor${stringConvert}`;

      const element = document.getElementById(idOfThatSpecificActivity);
      const elementInnerHTMLNumber =
        Number(element.innerHTML) + action["minutes"];
      element.innerHTML = elementInnerHTMLNumber;
    });
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
function groupByDate(objectsArray, property) {
  //function takes 2 arguments that are: an objectsArray is an array contains many object inside it (todayActions) and a property is the property that you want to group by (todayIs to group by date)
  return objectsArray.reduce((total, current) => {
    //then we use reduce to loop through all object inside that array(todayActions), with current is the current object inside the array(todayActions) and total is an object return after every call (initial with an empty object)
    const key = current[property];
    //we declared key is an object property's value, but we declared it to use as a key of total object (total is an object returns after every loop) (Ex:todayActions[0][todayIs];//2023 April 6)
    const value = total[key] ?? []; //?? operator check if first operand is null or undefined, if so, it will return the second operand, if not, it will return the first operand
    //then we declared value variable is the value of total object's key property.if this value is null or undefined, it will return an empty array, if not, it will return the value of that key property.( value will be an array)
    return { ...total, [key]: [...value, current] };
  }, {});
}

//call methods
Event.callAllEventListenerMethods();
// UI.callAllUIMethodsOnce();
