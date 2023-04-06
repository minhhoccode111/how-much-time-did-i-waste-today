// console.log("Hello world from animation.js");

//select elements
const h3TotalMinutes = document.getElementById("showTotalMinutesTodayH3");
const elementToggleToShow = document.getElementById("elementToggleToShow");

//event listener
h3TotalMinutes.addEventListener("click", () => {
  Animation.appear(elementToggleToShow);
  if (elementToggleToShow.classList.contains("none")) {
    elementToggleToShow.classList.remove("none");
  } else {
    elementToggleToShow.classList.add("none");
  }
});

// animation class
class Animation {
  static appear(elm, i, step, speed) {
    let t_o;
    i = i || 0;
    step = step || 5;
    speed = speed || 50;
    t_o = setInterval(() => {
      let opacity = i / 100;
      i = i + step;
      if (opacity > 1 || opacity < 0) {
        clearInterval(t_o);
        return;
      }
      elm.style.opacity = opacity;
      elm.style.filter = "blur(opacity=" + opacity * 100 + ")";
    }, speed);
  }
}
