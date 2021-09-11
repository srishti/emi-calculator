/**
 * Function to convert a given number to Indian currency (INR)
 * @param number - number to be converted
 * @param decimalPlaces - decimal places to which the number should be rounded off to
 * @returns number converted to INR currency
 */
export const convertNumberToIndianCurrency = (number, decimalPlaces = 0) => {
  number = +number;
  return number.toLocaleString("en-IN", {
    maximumFractionDigits: decimalPlaces,
    style: "currency",
    currency: "INR",
  });
};

/**
 * Function to get a number from the given locale string
 * @param localeString - locale string from which the number is to be extracted
 * @returns number extracted from locale string
 */
export const getNumberFromLocaleString = (localeString) => {
  return parseFloat(localeString.replace(/[^0-9-.]/g, ""));
};

/**
 * Function to get percentage of current value in the given slider range
 * @param min - minimum value in range
 * @param max - maximum value in range
 * @param value - current value
 * @returns percentage (or portion) of slider
 */
export const getSliderProgressRange = (min, max, value) => {
  return ((value - min) / (max - min)) * 100;
};

/**
 * Function to call an event handler with
 * @param event - event to be attached to event handler
 * @param timer - timer attached to debouncing
 * @param func - function to be invoked after lapse of timer
 */
export const bindDebounce = (event, timer, func) => {
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(() => {
    func(event);
  }, 1000);
};

/**
 * Function to convert a value in given range and round it off to given decimal places
 * @param min - minimum value in range
 * @param max - maximum value in range
 * @param step - step over which the value should be incremented or decremented
 * @param value - current value
 * @param shouldRoundOffToStep - true if the current value should be rounded off to 1 decimal place; false otherwise
 * @param decimalPlaces - places after decimal to be considered for rounding off the number
 * @returns converted value in given range and rounded off to given decimal places (if applicable)
 */
export const convertValueInRange = (
  min,
  max,
  step,
  value,
  shouldRoundOffToStep,
  decimalPlaces = 1
) => {
  if (!value || value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  if (shouldRoundOffToStep) {
    return (Math.round(value / step) * step).toFixed(decimalPlaces);
  }
  return value;
};
