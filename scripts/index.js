import * as helpers from "./utils/helpers.mjs";
import * as uiHelpers from "./utils/uiHelpers.mjs";
import * as uiConstants from "./utils/uiConstants.mjs";

// dom elements
let loanDomElements = {
  input: {},
  slider: {},
};
let timer;

/**
 * Function to get common DOM elements
 */
const getDomElements = () => {
  // input elements
  loanDomElements.input.principal = document.getElementById("principal-input");
  loanDomElements.input.tenure = document.getElementById("tenure-input");
  loanDomElements.input.rate = document.getElementById("interest-rate-input");

  // slider elements
  loanDomElements.slider.principal =
    document.getElementById("principal-slider");
  loanDomElements.slider.tenure = document.getElementById("tenure-slider");
  loanDomElements.slider.rate = document.getElementById("interest-rate-slider");
};

/**
 * Function to set default values for input and slider
 */
const setInputAndSliderDefaultValues = () => {
  // slider defaults
  const sliderDefaultValues = {
    principal: uiConstants.SLIDER_DEFAULTS.PRINCIPAL.VALUE,
    tenure: uiConstants.SLIDER_DEFAULTS.TENURE.VALUE,
    rate: uiConstants.SLIDER_DEFAULTS.RATE.VALUE,
  };

  // set principal input text and slider value
  const formattedPrincipalValue = uiHelpers.convertNumberToIndianCurrency(
    sliderDefaultValues.principal
  );
  loanDomElements.input.principal.value = formattedPrincipalValue;
  loanDomElements.slider.principal.value = sliderDefaultValues.principal;

  // set tenure input text and slider value
  loanDomElements.input.tenure.value = sliderDefaultValues.tenure;
  loanDomElements.slider.tenure.value = sliderDefaultValues.tenure;

  // set interest rate input text and slider value
  loanDomElements.input.rate.value = sliderDefaultValues.rate;
  loanDomElements.slider.rate.value = sliderDefaultValues.rate;
};

/**
 * Funtion to update EMI-related elements on DOM
 * @param emi - EMI value
 */
const updateEmiOnDom = (emi) => {
  // show calculated EMI value on DOM
  const formattedEmi = uiHelpers.convertNumberToIndianCurrency(emi);

  const emiDomElement = document.getElementById("emi-value");
  emiDomElement.innerText = formattedEmi;
};

/**
 * Function to update chart-related elements on DOM
 * @param principal - principal (loan amount)
 * @param totalInterest - total interest to be paid over time
 */
const updateChartOnDom = (principal, totalInterest) => {
  const totalInterestPercentage = +(
    (totalInterest / (principal + totalInterest)) *
    100
  ).toFixed(2);

  // update total interest slice in chart
  const interestSliceCircleElement = document.getElementById(
    "interest-chart-slice"
  );
  interestSliceCircleElement.setAttribute(
    "stroke-dasharray",
    `calc(${totalInterestPercentage} * (2 * 3.14 * 20) / 100) calc(2 * 3.14 * 20)`
  );

  // update chart inner text
  const chartTotalAmountElement = document.getElementById("chart-total-amount");
  chartTotalAmountElement.innerText = uiHelpers.convertNumberToIndianCurrency(
    principal + totalInterest
  );

  // update chart legends
  const principalChartLegendElement = document.getElementById(
    "principal-chart-legend"
  );
  principalChartLegendElement.innerText =
    uiHelpers.convertNumberToIndianCurrency(principal);

  const totalInterestChartLegendElement = document.getElementById(
    "interest-chart-legend"
  );
  totalInterestChartLegendElement.innerText =
    uiHelpers.convertNumberToIndianCurrency(totalInterest);
};

/**
 * Function to show results related to EMI and chart on DOM
 */
const showResults = () => {
  // calculate EMI value
  const principal = uiHelpers.getNumberFromLocaleString(
    loanDomElements.input.principal.value
  );
  const tenure = loanDomElements.input.tenure.value;
  const rate = loanDomElements.input.rate.value;

  const emi = helpers.getEmi(principal, tenure, rate);
  const totalInterest = helpers.getTotalInterest(principal, tenure, rate);

  updateEmiOnDom(emi);
  updateChartOnDom(principal, totalInterest);
};

/**
 * Function to update slider progress bar on DOM
 * @param {*} min - min value in the range of slider
 * @param {*} max - max value in the range of slider
 * @param {*} value - current value on the slider
 * @param {*} sliderElement - slider element to be updated on DOM
 */
const updateSliderProgress = (min, max, value, sliderElement) => {
  const sliderProgressRange = uiHelpers.getSliderProgressRange(min, max, value);

  sliderElement.style.background = `linear-gradient(to right, ${uiConstants.COLOR_PRIMARY} 0%, ${uiConstants.COLOR_PRIMARY} ${sliderProgressRange}%, ${uiConstants.COLOR_GRAY_LIGHT} ${sliderProgressRange}%, ${uiConstants.COLOR_GRAY_LIGHT} 100%)`;
};

/**
 * Function as event handler to respond to input changes in principal amount slider while seeking its progress bar
 * @param event
 */
const principalSliderSeekHandler = (event) => {
  const principalSliderValue = event.target.value;

  // update principal input text
  loanDomElements.input.principal.value =
    uiHelpers.convertNumberToIndianCurrency(principalSliderValue);

  // update principal slider progress
  updateSliderProgress(
    uiConstants.SLIDER_DEFAULTS.PRINCIPAL.MIN,
    uiConstants.SLIDER_DEFAULTS.PRINCIPAL.MAX,
    principalSliderValue,
    loanDomElements.slider.principal
  );

  showResults();
};

/**
 * Function as event handler to respond to input changes in tenure slider while seeking its progress bar
 * @param event
 */
const tenureSliderSeekHandler = (event) => {
  const tenureSliderValue = event.target.value;

  // update tenure input text
  loanDomElements.input.tenure.value = tenureSliderValue;

  // update tenure slider progress
  updateSliderProgress(
    uiConstants.SLIDER_DEFAULTS.TENURE.MIN,
    uiConstants.SLIDER_DEFAULTS.TENURE.MAX,
    tenureSliderValue,
    loanDomElements.slider.tenure
  );

  showResults();
};

/**
 * Function as event handler to respond to input changes in interest rate slider while seeking its progress bar
 * @param event
 */
const rateSliderSeekHandler = (event) => {
  const rateSliderValue = event.target.value;

  // update interest rate input text
  loanDomElements.input.rate.value = rateSliderValue;

  // update interest rate slider progress
  updateSliderProgress(
    uiConstants.SLIDER_DEFAULTS.RATE.MIN,
    uiConstants.SLIDER_DEFAULTS.RATE.MAX,
    rateSliderValue,
    loanDomElements.slider.rate
  );

  showResults();
};

/**
 * Function as event handler to respond to input changes in principal amount text box
 * @param event
 */
const principalInputChangeHandler = (event) => {
  const caretPosition = event.target.selectionStart;
  const currentValue = event.target.value;
  const { MIN, MAX, STEP } = { ...uiConstants.SLIDER_DEFAULTS.PRINCIPAL };

  const principalInputValue = uiHelpers.getNumberFromLocaleString(
    event.target.value
  );
  const principalInputValueInRange = uiHelpers.convertValueInRange(
    MIN,
    MAX,
    STEP,
    principalInputValue,
    false
  );

  // format and/or update principal input value (format when a digit is added or deleted; format & update when input value goes out of range)
  loanDomElements.input.principal.value =
    uiHelpers.convertNumberToIndianCurrency(principalInputValueInRange);

  // set caret position
  loanDomElements.input.principal.setSelectionRange(
    caretPosition,
    caretPosition
  );

  // update principal slider value
  loanDomElements.slider.principal.value = principalInputValueInRange;

  // update principal slider progress
  updateSliderProgress(
    MIN,
    MAX,
    principalInputValueInRange,
    loanDomElements.slider.principal
  );

  showResults();
};

/**
 * Function as event handler to respond to input changes in tenure text box
 * @param event
 */
const tenureInputChangeHandler = (event) => {
  const { MIN, MAX, STEP } = { ...uiConstants.SLIDER_DEFAULTS.TENURE };

  const tenureInputValue = +event.target.value;
  const tenureInputValueInRange = uiHelpers.convertValueInRange(
    MIN,
    MAX,
    STEP,
    tenureInputValue,
    false
  );

  // format and/or update tenure input value (format when a digit is added or deleted; format & update when input value goes out of range)
  loanDomElements.input.tenure.value = tenureInputValueInRange;

  // update tenure slider value
  loanDomElements.slider.tenure.value = tenureInputValueInRange;

  // update tenure slider progress
  updateSliderProgress(
    MIN,
    MAX,
    tenureInputValueInRange,
    loanDomElements.slider.tenure
  );

  showResults();
};

/**
 * Function as event handler to respond to input changes in interest rate text box
 * @param event
 */
const rateInputChangeHandler = (event) => {
  const { MIN, MAX, STEP } = { ...uiConstants.SLIDER_DEFAULTS.RATE };

  const rateInputValue = +event.target.value;
  const rateInputValueInRange = uiHelpers.convertValueInRange(
    MIN,
    MAX,
    STEP,
    rateInputValue,
    true
  );

  // format and/or update interest rate input value (format when a digit is added or deleted; format & update when input value goes out of range)
  loanDomElements.input.rate.value = rateInputValueInRange;

  // update interest rate slider value
  loanDomElements.slider.rate.value = rateInputValueInRange;

  // update interest rate slider progress
  updateSliderProgress(
    MIN,
    MAX,
    rateInputValueInRange,
    loanDomElements.slider.rate
  );

  showResults();
};

/**
 * Function to validate input typed in principal text box
 * @param event
 * VALIDATIONS - input should be a number / backspace key / left arrow key / right arrow key
 */
const validatePrincipalInput = (event) => {
  if (
    !(
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      event.keyCode === 8 ||
      event.keyCode === 37 ||
      event.keyCode === 39
    )
  ) {
    event.preventDefault();
  }
};

/**
 * Function to validate input typed in tenure text box
 * @param event
 * VALIDATIONS - input should be a number / backspace key / left arrow key / right arrow key
 */
const validateTenureInput = (event) => {
  if (
    !(
      (event.keyCode >= 48 && event.keyCode <= 57) ||
      event.keyCode === 8 ||
      event.keyCode === 37 ||
      event.keyCode === 39
    )
  ) {
    event.preventDefault();
  }
};

/**
 * Function to attach event listeners to all sliders and input boxes for principal amount, tenure and interest rate
 * @param event
 */
const attachAllEventListeners = () => {
  // attaching event listeners on changing slider values (while seeking its progress bar) to update text boxes
  loanDomElements.slider.principal.addEventListener(
    "input",
    principalSliderSeekHandler
  );
  loanDomElements.slider.tenure.addEventListener(
    "input",
    tenureSliderSeekHandler
  );
  loanDomElements.slider.rate.addEventListener("input", rateSliderSeekHandler);

  // attaching event listeners on changes in input boxes to update slider progress
  loanDomElements.input.principal.addEventListener("input", (event) => {
    uiHelpers.bindDebounce(event, timer, principalInputChangeHandler);
  });
  loanDomElements.input.tenure.addEventListener("input", (event) => {
    uiHelpers.bindDebounce(event, timer, tenureInputChangeHandler);
  });
  loanDomElements.input.rate.addEventListener("input", (event) => {
    uiHelpers.bindDebounce(event, timer, rateInputChangeHandler);
  });

  // attaching event listeners on input boxes for input validations
  loanDomElements.input.principal.addEventListener(
    "keydown",
    validatePrincipalInput
  );
  loanDomElements.input.tenure.addEventListener("keydown", validateTenureInput);
};

/**
 * Function to initialize application
 */
const initApp = () => {
  getDomElements();
  setInputAndSliderDefaultValues();
  attachAllEventListeners();
  showResults();
};

window.addEventListener("load", initApp);
