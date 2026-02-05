/**
 * Benjamin Graham's Value Formula
 * V = SQRT(22.5 * EPS * BookValuePerShare)
 */
export const calculateGrahamNumber = (eps: number, bvps: number): number => {
  if (eps <= 0 || bvps <= 0) return 0;
  return Math.sqrt(22.5 * eps * bvps);
};

/**
 * Calculate dynamic discount rate using CAPM
 * WACC = Risk-Free Rate + Beta × Market Risk Premium
 * @param beta Company beta (default 1.0 = market average)
 */
export const calculateDiscountRate = (beta: number = 1.0): number => {
  const riskFreeRate = 0.045; // 4.5% (approximate 10Y Treasury 2026)
  const marketRiskPremium = 0.06; // 6% historical equity risk premium
  return riskFreeRate + (beta * marketRiskPremium);
};

/**
 * 5-Year DCF Shortcut
 * Assumes 5 years of growth + terminal growth based on GDP
 * @param fcf Free Cash Flow
 * @param growth Growth rate (decimal, e.g., 0.10 for 10%)
 * @param discount Discount rate (decimal, e.g., 0.10 for 10%)
 */
export interface DCFProjection {
  year: number;
  fcf: number;
  discountedValue: number;
}

export interface DCFResult {
  value: number;
  projections: DCFProjection[];
  terminalValue: number;
  presentTerminalValue: number;
}

export const calculateSimpleDCF = (fcf: number, growth: number, discount: number): DCFResult => {
  let totalValue = 0;
  if (discount <= 0) return { value: 0, projections: [], terminalValue: 0, presentTerminalValue: 0 };

  const projections: DCFProjection[] = [];

  for (let i = 1; i <= 5; i++) {
    const futureFCF = fcf * Math.pow(1 + growth, i);
    const discountedVal = futureFCF / Math.pow(1 + discount, i);
    totalValue += discountedVal;
    projections.push({
      year: i,
      fcf: futureFCF,
      discountedValue: discountedVal
    });
  }

  // Terminal Value (simplified: 5th year FCF * (1+g) / (discount - terminal_growth))
  // Terminal growth = long-term GDP growth (companies can't outgrow economy forever)
  const terminalGrowth = 0.025; // 2.5% long-term US GDP growth expectation
  // Last year FCF
  const lastFCF = projections[projections.length - 1].fcf;

  const terminalValue = (lastFCF * (1 + terminalGrowth)) / (discount - terminalGrowth);
  const presentTerminalValue = terminalValue / Math.pow(1 + discount, 5);

  totalValue += presentTerminalValue;

  return {
    value: totalValue,
    projections,
    terminalValue,
    presentTerminalValue
  };
};

/**
 * Owner Earnings Yield
 * Owner Earnings = Net Income + Depreciation & Amortization - PaintEx (Maintenance Capex)
 * Yield = Owner Earnings / Market Cap
 * 
 * Note: Since Maintenance Capex is hard to distinguish from Growth Capex in raw data,
 * we often use total Capex as a conservative estimate.
 */
export const calculateOwnerEarningsYield = (netIncome: number, depreciation: number, capex: number, marketCap: number): number => {
  if (marketCap <= 0) return 0;
  // Capex is usually negative in cash flow statements, so we add it if it's negative, or subtract if it's positive.
  // Standard convention: Net Income + D&A - |Capex|
  // If capex passed is negative (outflow), we add it (reducing the total).
  // Let's assume input is absolute value for clarity, or handle sign.
  // Generally APIs return Capex as negative.

  const absCapex = Math.abs(capex);
  const ownerEarnings = netIncome + depreciation - absCapex;

  return (ownerEarnings / marketCap) * 100; // Return as percentage
};

/**
 * PEG Ratio-Based Fair Value
 * Peter Lynch's actual rule: Fair P/E = Growth Rate
 * A PEG ratio of 1.0 indicates fair value
 * 
 * @param eps Earnings Per Share
 * @param growthRate Expected growth rate (decimal, e.g., 0.15 for 15%)
 * @param currentPrice Current stock price (for PEG calculation)
 * @returns Object with fair value and current PEG ratio
 */
export interface PEGResult {
  fairValue: number;
  pegRatio: number;
  fairPE: number;
}

export const calculatePEGValue = (eps: number, growthRate: number, currentPrice: number): PEGResult => {
  if (eps <= 0 || growthRate <= 0) {
    return { fairValue: 0, pegRatio: 0, fairPE: 0 };
  }

  // Convert growth to percentage (0.15 -> 15)
  const growthPercent = growthRate * 100;

  // Lynch's rule: Fair P/E = Growth Rate
  const fairPE = growthPercent;
  const fairValue = eps * fairPE;

  // Calculate current PEG ratio
  const currentPE = currentPrice / eps;
  const pegRatio = currentPE / growthPercent;

  return {
    fairValue,
    pegRatio,
    fairPE
  };
};

/**
 * Dividend Discount Model (Gordon Growth Model)
 * P = D1 / (r - g)
 * D1 = Next Year's Dividend
 * r = Cost of Equity (Required Rate of Return) - Assume 8-10%
 * g = Dividend Growth Rate -> conservative estimate or sustainable growth rate
 */
export const calculateDDM = (dividendRate: number, growthRate: number): number => {
  if (dividendRate <= 0) return 0;

  // If growth rate is too high (close to or > discount rate), formula breaks.
  // Cap growth at stable perpetual rate, e.g., 3-4%. 
  // DDM is strictly for stable growers.
  // Let's assume a Required Return (r) of 9% (0.09).
  const r = 0.09;

  // Cap g at 4% for calculation stability if it's purely terminal DDM
  const stableGrowth = Math.min(growthRate, 0.04);

  if (stableGrowth >= r) return 0; // Model breaks

  const nextDividend = dividendRate * (1 + stableGrowth);
  return nextDividend / (r - stableGrowth);
};
