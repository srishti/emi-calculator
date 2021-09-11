/**
 * Function to get total months from a given time period (in years)
 * @param tenureInYears - tenure in years
 * @returns total number of months in given number of years
 */
export const getMonthsFromTenure = (tenureInYears) => {
  tenureInYears = +tenureInYears;
  return tenureInYears * 12;
};

/**
 * Function to get total interest payable over the given time period
 * @param principal - principal loan amount
 * @param tenure - time period (in years)
 * @param rate - rate of interest
 * @returns total interest payable along with the principal
 */
export const getTotalInterest = (principal, tenure, rate) => {
  principal = +principal;
  tenure = +tenure;
  rate = +rate;

  return principal * tenure * rate * 0.01;
};

/**
 * Function to get payable EMI
 * @param principal - principal loan amount
 * @param tenure - time period (in years)
 * @param rate - rate of interest
 * @returns EMI payable
 */
export const getEmi = (principal, tenure, rate) => {
  principal = +principal;
  tenure = +tenure;
  rate = +rate;

  if (tenure === 0) {
    return 0;
  }

  const totalInterest = getTotalInterest(principal, tenure, rate);
  const amount = principal + totalInterest;

  const totalMonthsInTenure = getMonthsFromTenure(tenure);
  return amount / totalMonthsInTenure;
};
