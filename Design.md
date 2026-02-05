Design Document: QuantLeaf
Project Status: Initial Blueprint (v1.0)

Objective: A high-performance, logic-driven fundamental analysis dashboard for "Defensive Investors."

1. System Overview
QuantLeaf is a Next.js application that bypasses "AI hype" in favor of deterministic financial models. It pulls raw data from public URLs (Yahoo Finance/SEC) and applies quantitative formulas (DCF, Graham Number) to determine a stock's Intrinsic Value.

Core Pillars:
Zero-AI Reliability: All "intelligence" is derived from open-source mathematical formulas.

URL-to-Insight: Direct parsing of public HTML/XML to avoid high-cost data subscriptions.

Performance: Leveraging Vercel’s Edge Network for sub-second analysis rendering.

2. Key Features (The "Intelligence" Layer)
A. The Intrinsic Sandbox (Comparative Valuation)
Instead of a single price, the app provides a "Fair Value Range" by calculating three scientific metrics simultaneously:

Discounted Cash Flow (DCF): Projects 5-year Free Cash Flow (FCF) and discounts it to the present.

Graham Number: Calculates the maximum price a defensive investor should pay based on Earnings (EPS) and Book Value (BVPS).

Owner Earnings Yield: A Warren Buffett favorite that adjusts Net Income for Capital Expenditures.

B. "Ticker-Trace" URL Parser
A tool where users paste a Yahoo Finance "Analysis" URL or an SEC Filing URL.

Logic: The server scrapes the HTML for specific data tags (e.g., Trailing P/E, Debt/Equity) and compares them against historical averages stored in a temporary cache.

Validation: It cross-references the URL data against a secondary API (like Polygon.io) to ensure the "URL data" hasn't been tampered with or delayed.

C. Relative Strength Heatmap
Visualizes how a ticker is performing relative to its industry peers.

Intelligence: If the Ticker is +2% but the Sector URL shows the industry is -1%, the app flags this as "Divergent Strength."

3. Technical Architecture
The Tech Stack:
Framework: Next.js 15 (App Router).

Language: TypeScript (Strict Mode).

Data Scraper: Cheerio (for URL parsing) and yahoo-finance2.

Visuals: Tremor (for business-grade dashboards) and Lucide-React (icons).

Deployment: Vercel (using Server Actions for all data fetching).

Data Flow Diagram:
User Input: Enters Ticker (e.g., TSLA) or URL.

Server Action: Initiates a Promise.all() to fetch data from (a) Stock API and (b) Public URL.

Logic Engine: TypeScript functions process the DCF and Graham formulas.

UI Render: Results are streamed to the client using React Suspense.

4. Mathematical Logic (Sample Code)
To prove "Science-over-AI," the app uses strictly typed math functions:

TypeScript
/**
 * Benjamin Graham's Value Formula
 * V = SQRT(22.5 * EPS * BookValuePerShare)
 */
export const calculateGrahamNumber = (eps: number, bvps: number): number => {
  if (eps <= 0 || bvps <= 0) return 0;
  return Math.sqrt(22.5 * eps * bvps);
};

/**
 * 5-Year DCF Shortcut
 * Assumes 5 years of growth + 2% terminal growth
 */
export const calculateSimpleDCF = (fcf: number, growth: number, discount: number): number => {
  let totalValue = 0;
  for (let i = 1; i <= 5; i++) {
    totalValue += fcf * Math.pow(1 + growth, i) / Math.pow(1 + discount, i);
  }
  return totalValue;
};
5. UI/UX Plan: "The Dashboard"
The interface will follow a Bento Grid layout, commonly used in premium 2026 SaaS apps:

Top Left: Live Price & "Ticker-Trace" Status (Is the data fresh?).

Center: The "Intrinsic Value" Gauge (Comparing current price to the 3 formulas).

Right Side: URL Feed (Latest headlines parsed for sentiment scores).

Bottom: Historical P/E vs. Industry Median Chart.

6. Future Expansion (V2)
Vercel Cron Jobs: Automatically scrape SEC filings every Friday at market close.

User Accounts: Allow users to save their "Intrinsic Value" assumptions for different stocks.