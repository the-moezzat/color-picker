import iro from "@jaames/iro";

const navigators = document.querySelectorAll(".nav");
const eyeDropper = document.querySelector(".eye-drop");
const colors = document.querySelector(".colors");
const codeBox = document.querySelector(".color-code");
const colorCode = codeBox.querySelector(".color-code-value");
const colorType = codeBox.querySelector(".color-code-type");
const copyBtn = codeBox.querySelector(".color-code-btn");
const clearRecent = document.querySelector(".clear-recent-colors");
const colorValueNav = document.querySelector(".color-code-toggle");
const toolContainers = document.querySelectorAll(".tool");

const state = {
  currentColor: new iro.Color(),
  activeColorEl: "",
  colorValueType: "hexString",
  tab: {
    name: "color-picker",
    tabEl: document.querySelector(`.tool[data-type="color-picker"]`),
    navEl: document.querySelector(`.nav-item[data-type="color-picker"]`),
  },
  recentColors: [],
};

const changeIndicatorPosition = function (indicator, mainEl, relativeEl) {
  const mainBounding = mainEl.getBoundingClientRect();
  const space = mainBounding.left - relativeEl.getBoundingClientRect().left;
  indicator.style.left = `${space}px`;
  indicator.style.width = `${mainBounding.width}px`;
  indicator.style.height = `${mainBounding.height}px`;
};

navigators.forEach((nav) => {
  let active = nav.querySelector(".nav-item--active");
  changeIndicatorPosition(nav.querySelector(".nav-indicator"), active, nav);

  nav.addEventListener("mouseover", function (e) {
    const box = this.querySelector(".nav-indicator");
    const target = e.target.closest(".nav-item");

    if (!target) return;

    changeIndicatorPosition(box, target, nav);

    target.addEventListener("mouseleave", (e) => {
      changeIndicatorPosition(box, active, nav);
    });

    target.addEventListener("click", () => {
      active.classList.remove("nav-item--active");
      target.classList.add("nav-item--active");
      active = target;
    });
  });
});
const colorEl = (color) => {
  const html = document.createElement("li");
  const span = document.createElement("span");
  span.classList.add("color-box");
  html.classList.add("color");
  html.dataset.color = color;
  span.style.backgroundColor = color;
  html.style.color = color;
  html.insertAdjacentElement("afterbegin", span);
  return html;
};

const colorPicker = new iro.ColorPicker("#picker", {
  width: 200,
  color: "#ffffff",
  layout: [
    {
      component: iro.ui.Box,
    },

    {
      component: iro.ui.Slider,
      options: {
        sliderType: "hue",
      },
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: "alpha",
      },
    },
  ],
  layoutDirection: "horizontal",
  borderColor: "#fff",
  borderWidth: 3,
});

eyeDropper.addEventListener("click", (e) => {
  const picker = new EyeDropper();

  picker.open().then(({ sRGBHex: color }) => {
    const el = colors.insertAdjacentElement("afterbegin", colorEl(color));

    const colorObj = {
      colorEl: el,
      color: color,
    };

    state.activeColorEl
      ? state.activeColorEl
          .querySelector(".color-box")
          .classList.remove("color-box--active")
      : "";

    state.recentColors.push(colorObj);
    state.activeColorEl = el;

    state.activeColorEl
      .querySelector(".color-box")
      .classList.add("color-box--active");

    state.currentColor.set(color);
    colorPicker.color.hexString = color;

    colorCode.textContent = color;
  });
});

copyBtn.addEventListener("click", function (e) {
  navigator.clipboard.writeText(state.currentColor[state.colorValueType]);
  colorCode.textContent = "Copied";
  setTimeout(() => {
    colorCode.textContent = state.currentColor[state.colorValueType];
  }, 500);
});

colorPicker.on("color:change", (color) => {
  colorCode.textContent = color[state.colorValueType];
  state.currentColor = color;
  if (!state.activeColorEl) return;
  changeActiveColorEl(color);
});

function changeActiveColorEl(color) {
  state.activeColorEl.dataset.color = color.rgbaString;
  state.activeColorEl.querySelector("span").style.backgroundColor =
    color.rgbaString;
}

colors.addEventListener("click", function (e) {
  const target = e.target;

  if (!target.classList.contains("color-box")) return;

  const colorEl = target.closest(".color");

  state.activeColorEl
    .querySelector(".color-box")
    .classList.remove("color-box--active");
  colorEl.querySelector(".color-box").classList.add("color-box--active");

  state.activeColorEl = colorEl;
  state.currentColor.set(colorEl.dataset.color);
  colorPicker.color.rgbaString = colorEl.dataset.color;
});

clearRecent.addEventListener("click", (e) => {
  state.recentColors = [];
  colors.innerHTML = "";
});

chrome.storage;

colorValueNav.addEventListener("click", function (e) {
  const target = e.target;

  if (!target.classList.contains("nav-item")) return;

  state.colorValueType = target.dataset.type;
  colorCode.textContent = state.currentColor[state.colorValueType];
  colorType.textContent = target.textContent;
});

// Observer function
const options = {
  root: document.querySelector(".tools"),
  rootMargin: "0px",
  threshold: 0.8,
};

const observer = new IntersectionObserver((entries) => {
  const intersectionData = entries[0];
  const nav = document.querySelector(".nav--main");

  if (!intersectionData.isIntersecting) return;
  const tabName = intersectionData.target.dataset.type;

  state.tab.navEl.classList.remove("nav-item--active");

  state.tab = {
    name: "color-picker",
    tabEl: document.querySelector(`.tool[data-type="${tabName}"]`),
    navEl: document.querySelector(`.nav-item[data-type="${tabName}"]`),
  };

  changeIndicatorPosition(
    nav.querySelector(".nav-indicator"),
    state.tab.navEl,
    nav
  );

  state.tab.navEl.classList.add("nav-item--active");
}, options);

toolContainers.forEach((tool) => observer.observe(tool));

// Handle Buy me a coffee button
const bmcBtn = document.querySelectorAll(".bmc");

bmcBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    chrome.tabs.create({
      url: "https://www.buymeacoffee.com/moezzat",
    });
  });
});
