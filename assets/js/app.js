// console.log("Hello world from app.js");

//storage
class Storage {
  static setTodayActionsToStorage(arr) {
    //setTodayActionsToStorage method will take an array as its argument
    const todayDate = whatDayIsToday(); //remember to change back //FIXME
    // todayDate = "2023 April 7";
    //then declare a variable named todayDate and assign value returns from whatDayIsToday function (ex: 2023 April 7)
    localStorage.setItem(todayDate, JSON.stringify(arr));
    // localStorage.setItem(todayDate, JSON.stringify([])); //use this line to reset localStorage, remember to change back //FIXME
    //and then we setItem to localStorage by using JSON.stringify to convert our todayActions array to string
    //and because we set the name of that array is the date that array has been created so we will have a new array everyday
  }
  static getTodayActionsFromStorage() {
    const todayDate = whatDayIsToday();
    let storage =
      localStorage.getItem(todayDate) === null
        ? []
        : JSON.parse(localStorage.getItem(todayDate));
    // storage = []; //use this line to reset localStorage, remember to change back //FIXME
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
}

//event listener
class Event {
  static formSubmit() {
    getInputForm.addEventListener("submit", (e) => {
      //when form has submit event
      e.preventDefault();
      let getMinutesCount = Number(minutesCount.textContent);
      //getMinutesCount variable take minutesCount element's text content value (what we display on the page) after converting to number
      if (getMinutesCount === 0) return;
      //but if is 0 (mean the activity take 0 minutes and that's meaningless) then we just ignore it and return
      //preventDefault so that it won't load the page again
      let getTodayDate = whatDayIsToday();
      //getTodayDate variable use function whatDayIsToday to get date (Ex:2023 April 6)
      let getTodayTime = whatTimeIsIt();
      //getTodayTime variable use function whatTimeIsIt to get the time when we submit the form (Ex: 15:36)
      let getActivity;
      //declare a variable named getActivity to contain activity value of the form
      activityRadioButtons.forEach((action) => {
        //then we loop through every radio button to check
        if (action.checked) getActivity = translateActionsValueTo[action.value];
        //if the radio button is checked then we translate if through translateActionsValueTo object with its value and assign to getActivity variable
      });
      const newAction = new Action(
        //then we create a new Action's instance with
        getMinutesCount,
        //minutes of instance is getMinutesCount variable
        getActivity,
        //activity of instance is getActivity variable
        getTodayDate,
        //todayIs of instance is getTodayDate variable
        getTodayTime
        //timeIs of instance is getTodayTime variable
      );
      todayActions.push(newAction);
      //then we push newAction instance to todayActions array
      Storage.setTodayActionsToStorage(todayActions);
      //then we update todayActions array to localStorage
      history = groupByDate(todayActions, "todayIs");
      //FIXME fix this history variable because if it use function groupByDate that takes 2 arguments (1 is an array that contains every Action's instance we created by submitting to form, and 1 is a property name tell it to group by every value existed of the property name)
      //FIXME but this is not going to work because if we use this function with todayActions array (which will be re-created everyday) then the history variable is only contains actions of 1 day (instead of everyday from the beginning when we start using the app)
      //FIXME this is missing logic that we've made. So to be able to fix this, we must create another variable (which is an array) that will contain every Action's instance we've been created so far.
      //FIXME that variable will be named everySingleActionSoFar and will be pushed at the same time with todayActions and will be set
      Storage.setTodayActionsToStorageHistory(history);
      UI.callAllUIMethodsOnce();
      console.log(history);
    });
  }
  static addMinutesClick() {
    addMinutesButtons.forEach((button) => {
      //loop through every button of addMinutesButtons object
      button.addEventListener("click", (e) => {
        //listen for each button event click
        let currentMinutes = Number(minutesCount.textContent);
        //assign current minutes currently display on the web to a variable named currentMinutes after convert its type to number
        let addUpValue = Number(e.target.textContent);
        //assign a value of the button we clicked (value of button is its textContent, is anything it display) after we convert its value (usually string) to number to a variable named addUpValue
        minutesCount.innerHTML = currentMinutes + addUpValue;
        //and display it by assigning value of the calculation(currentMinutes is minutesCount display on page and addUpValue is value of button we clicked) to innerHTML
      });
    });
  }
  static showTodayWhenDOMLoaded() {
    window.addEventListener("DOMContentLoaded", () => {
      //when DOM is loaded
      todayDateIs.innerHTML = whatDayIsToday();
      //display today date with function whatDayIsToday()
      UI.callAllUIMethodsOnce();
      //initial UI with content load from localStorage and display on the page and reset form to default
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
    UI.updateEveryActivityTotalMinutes();
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
//call all event listener methods first because it has DOM content loaded event that should be call when the page first load
//and buttons click event listener to change minutes display on form
//and form submit event to create new Action Constructor instance
