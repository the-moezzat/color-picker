import iro from "@jaames/iro";

const navigators = document.querySelectorAll(".nav");
const eyeDropper = document.querySelector(".eye-drop");
const colors = document.querySelector(".colors");
const codeBox = document.querySelector(".color-code");
const colorCode = codeBox.querySelector(".color-code-value");
const copyBtn = codeBox.querySelector(".color-code-btn");

const state = {
  currentColor: "#ffffff",
  activeEl: "",
  colorValueType: "hexString",
  tap: "color picker",
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

    state.recentColors.push(colorObj);
    state.activeEl = el;

    console.log(state);
    state.currentColor = color;
    colorPicker.color.hexString = color;

    colorCode.textContent = color;
  });
});

copyBtn.addEventListener("click", function (e) {
  navigator.clipboard.writeText(state.currentColor);
  colorCode.textContent = "Copied";
  setTimeout(() => {
    colorCode.textContent = state.currentColor;
  }, 500);
  console.log(state.activeEl);
});

colorPicker.on("color:change", (color) => {
  colorCode.textContent = color[state.colorValueType];
  changeActiveEl(color);
});

function changeActiveEl(color) {
  state.activeEl.dataset.color = color.rgbaString;
  state.activeEl.querySelector("span").style.backgroundColor = color.rgbaString;
}

colors.addEventListener("click", function (e) {
  const target = e.target;

  if (!target.classList.contains("color-box")) return;

  const colorEl = target.closest(".color");

  state.activeEl = colorEl;
  state.currentColor = colorEl.dataset.color;
  colorPicker.color.rgbaString = colorEl.dataset.color;
});
