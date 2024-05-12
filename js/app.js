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
  popup: {
    index: document.getElementById("add-habbit-popup"),
    iconField: document.querySelector(".popup__form input[name='icon']"),
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

function togglePopup() {
  if (page.popup.index.classList.contains("cover_hidden")) {
    page.popup.index.classList.remove("cover_hidden");
  } else {
    page.popup.index.classList.add("cover_hidden");
  }
}

function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = "";
  }
}

function validateAndGetForm(form, fields) {
  const dataFornm = new FormData(form);
  const res = {};

  for (const field of fields) {
    const fieldValue = dataFornm.get(field);
    form[field].classList.remove("error");
    if (!fieldValue) {
      form[field].classList.add("error");
    }
    res[field] = fieldValue;
  }

  for (const field of fields) {
    if (!res[field]) {
      return;
    }
  }

  return res;
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
		<button class="hobbit__delete" onclick="deleteDays(${index})">
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
  document.location.replace(document.location.pathname + "#" + activeHabbitId);
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderBody(activeHabbit);
}

//work with days
function addDays(event) {
  event.preventDefault();
  const data = validateAndGetForm(event.target, ["comment"]);
  if (!data) {
    return;
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment: data.comment }]),
      };
    }
    return habbit;
  });
  resetForm(event.target, ["comment"]);
  rerender(globalActiveHabbitId);
  saveData();
}

function deleteDays(index) {
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      habbit.days.splice(index, 1);
      return habbit;
    }
    return habbit;
  });
  rerender(globalActiveHabbitId);
  saveData();
}

//working with habbits
function setIcon(context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector(".icon.icon_active");
  activeIcon.classList.remove("icon_active");
  context.classList.add("icon_active");
}

function addHabbit(event) {
  event.preventDefault();
  const data = validateAndGetForm(event.target, ["name", "icon", "target"]);
  if (!data) {
    return;
  }

  const maxId = habbits.reduce(
    (acc, habbit) => (acc > habbit.id ? acc : habbit.id),
    0
  );

  const habbit = {
    id: maxId + 1,
    icon: data.icon,
    name: data.name,
    target: data.target,
    days: [],
  };

  habbits.push(habbit);
  resetForm(event.target, ["name", "icon", "target"]);
  togglePopup();
  saveData();
  rerender(maxId + 1);
}

(() => {
  loadData();
  const hashId = Number(document.location.hash.replace("#", ""));
  const urlHabbit = habbits.find((habbit) => habbit.id === hashId);
  if (urlHabbit) {
    rerender(urlHabbit.id);
  } else {
    rerender(habbits[0].id);
  }
})();
