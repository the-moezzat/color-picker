import iro from "@jaames/iro";

const navigators = document.querySelectorAll(".nav");
const eyeDropper = document.querySelector(".eye-drop");
const colors = document.querySelector(".colors");
const codeBox = document.querySelector(".color-code");
const colorCode = codeBox.querySelector(".color-code-value");
const copyBtn = codeBox.querySelector(".color-code-btn");

const state = {
  currentColor: "#ffffff",
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
  return `<li class="color" data-color="${color}" style="background-color: ${color}"><span></span></li>`;
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
    state.recentColors.push(color);
    colors.insertAdjacentHTML("afterbegin", colorEl(color));

    state.currentColor = color;
    colorPicker.color.hexString = color;
    console.log(state);

    colorCode.textContent = color;
  });
});

copyBtn.addEventListener("click", function (e) {
  navigator.clipboard.writeText(state.currentColor);
  colorCode.textContent = "Copied";
  setTimeout(() => {
    colorCode.textContent = state.currentColor;
  }, 500);
});

colorPicker.on("color:change", (color) => {
  colorCode.textContent = color[state.colorValueType];
});
