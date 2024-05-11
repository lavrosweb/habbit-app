"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

// page
const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".h1"),
    progressPrecent: document.querySelector(".progress__precent"),
    progressCoverBar: document.querySelector(".progress__cover-bar"),
  },
  body: {
    hobbits: document.querySelector(".hobbits"),
    nextDay: document.querySelector(".hobbit__day"),
  },
};

// utils
function loadData() {
  const habbitString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitString);
  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

// render
function rerenderMenu(activeHabbit) {
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      const element = document.createElement("button");
      element.setAttribute("menu-habbit-id", habbit.id);
      element.classList.add("menu__item");
      element.addEventListener("click", () => rerender(habbit.id));
      element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`;
      if (activeHabbit.id === habbit.id) {
        element.classList.add("menu__item_active");
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add("menu__item_active");
    } else {
      existed.classList.remove("menu__item_active");
    }
  }
}

function rerenderHead(activeHabbit) {
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPrecent.innerText = `${progress.toFixed(0)}%`;
  page.header.progressCoverBar.setAttribute("style", `width: ${progress}%`);
}

function rerenderBody(activeHabbit) {
  page.body.hobbits.innerHTML = "";
  for (const index in activeHabbit.days) {
    const element = document.createElement("div");
    element.classList.add("hobbit");
    element.innerHTML = `<div class="hobbit__day">День ${
      Number(index) + 1
    }</div>
		<div class="hobbit__comment">
		  ${activeHabbit.days[index].comment}
		</div>
		<button class="hobbit__delete">
		  <img src="./images/delete.svg" alt="Удалить день" />
		</button>`;
    page.body.hobbits.appendChild(element);
  }
  page.body.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}

function rerender(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId;
  console.log(globalActiveHabbitId);
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderBody(activeHabbit);
}

//work with days
function addDays(event) {
  const form = event.target;
  event.preventDefault();
  const data = new FormData(form);
  const comment = data.get("comment");
  form["comment"].classList.remove("error");
  if (!comment) {
    form["comment"].classList.add("error");
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment }]),
      };
    }
    return habbit;
  });
  form["comment"].value = "";
  rerender(globalActiveHabbitId);
  saveData();
}

(() => {
  loadData();
  rerender(habbits[0].id);
})();
