# QuantLeaf

**Deterministic Fundamental Analysis Platform**

QuantLeaf is a modern financial analysis tool designed to strip away the noise of technical analysis and market sentiment, focusing purely on the fundamental data that drives long-term value. Built with Next.js 15 and TypeScript, it provides instant, intrinsic value calculations for Stocks, Bonds, Indices, and Commodities.

🔗 **[Live Demo](https://quant-leaf.vercel.app)**

## Key Features

- **Intrinsic Value Calculation**: Automatically calculates Graham Number, PEG Ratio, and DCF models for any US stock.
- **Multi-Asset Support**: Specialized analysis for Stocks, Government Bonds, Major Indices, and Commodities.
- **Interactive History**: Switch between 1-Year and 5-Year historical price data with dynamic charting.
- **Formula Transparency**: Hover over any metric to see the exact formula and inputs used in calculations.
- **Zero-AI Hallucinations**: All analysis is deterministic, based on hard financial formulas and logic, not generative text.
- **Instant Insights**: "Key Points" and "Sentiment" summaries generated from real-time data properties.

## Technical Highlights

- **Dynamic CAPM-Based Discount Rates**: Uses Risk-Free Rate + Beta × Market Risk Premium (~10.5% for average stocks)
- **Proper PEG Ratio Implementation**: Peter Lynch's actual methodology (Fair P/E = Growth Rate), not the flawed "Lynch + Yield" variant
- **Complete Owner Earnings Formula**: Includes Depreciation & Amortization from cash flow statements
- **GDP-Based Terminal Growth**: 2.5% perpetual growth assumption aligned with economic fundamentals
- **Scientific Accuracy**: All formulas are academically correct and textbook-compliant

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data**: Yahoo Finance API (via `yahoo-finance2`) & Cheerio for web scraping

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router pages and layouts
- `app/actions/`: Server Actions for data fetching and analysis logic
- `components/`: React UI components (Dashboard, Charts, Gauges)
- `services/`: External API integrations and data transformation services
- `lib/financial/`: Pure functions for financial formulas (DCF, DDM, PEG, etc.)

## Valuation Methodologies

### Graham Number
Benjamin Graham's formula for maximum fair price: `√(22.5 × EPS × Book Value)`

### PEG Ratio
Peter Lynch's rule: Fair P/E equals growth rate. A PEG of 1.0 indicates fair value.

### DCF (Discounted Cash Flow)
5-year projection of free cash flows discounted to present value using CAPM-based rates.

### Owner Earnings Yield
Warren Buffett's preferred metric: `(Net Income + D&A - Capex) / Market Cap`

### DDM (Dividend Discount Model)
Gordon Growth Model for stable dividend payers.

## Philosophy

In an era of AI hype, QuantLeaf returns to the roots of value investing. It doesn't tell you *what* to buy; it gives you the mathematically correct value of an asset so you can make your own informed decision.

> "Price is what you pay. Value is what you get." - Warren Buffett

## Disclaimer

QuantLeaf is for educational purposes only. This is not financial advice. Always do your own research and consult with a qualified financial advisor before making investment decisions.

## License

MIT
