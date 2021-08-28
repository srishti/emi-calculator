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
 * Function to get interest payable per month
 * @param principal - principal loan amount
 * @param tenure - time period (in years)
 * @param rate - rate of interest
 * @returns interest payable per month
 */
export const getInterestPerMonth = (principal, tenure, rate) => {
  principal = +principal;
  tenure = +tenure;
  rate = +rate;

  if (tenure === 0) {
    return 0;
  }

  const totalMonthsInTenure = getMonthsFromTenure(tenure);
  return (principal * rate * 0.01 * tenure) / totalMonthsInTenure;
};

/**
 * Function to get total interest payable over the given time period
 * @param principal - principal loan amount
 * @param tenure - time period (in years)
 * @param rate - rate of interest
 * @returns interest payable per month
 */
export const getTotalInterest = (principal, tenure, rate) => {
  const interestPerMonth = getInterestPerMonth(principal, tenure, rate);
  return interestPerMonth * getMonthsFromTenure(tenure);
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

  const interestPerMonth = getInterestPerMonth(principal, tenure, rate);
  const totalMonthsInTenure = getMonthsFromTenure(tenure);
  return principal / totalMonthsInTenure + interestPerMonth;
};
