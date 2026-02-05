# QuantLeaf

**Deterministic Fundamental Analysis Platform**

QuantLeaf is a modern financial analysis tool designed to strip away the noise of technical analysis and market sentiment, focusing purely on the fundamental data that drives long-term value. Built with Next.js 15 and TypeScript, it provides instant, intrinsic value calculations for Stocks, Bonds, Indices, and Commodities.

## Key Features

- **Intrinsic Value Calculation**: Automatically calculates Graham Number, Peter Lynch Fair Value, and DCF models for any US stock.
- **Multi-Asset Support**: specialized analysis for Stocks, Government Bonds, Major Indices, and Commodities.
- **Interactive History**: Switch between 1-Year and 5-Year historical price data with dynamic charting.
- **Zero-AI Hallucinations**: All analysis is deterministic, based on hard financial formulas and logic, not generative text.
- **Instant Insights**: "Key Points" and "Sentiment" summaries generated from real-time data properties.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data**: Yahoo Finance API (via `yahoo-finance2`) & Cheerio for web scraping.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `app/actions/`: Server Actions for data fetching and analysis logic.
- `components/`: React UI components (Dashboard, Charts, Gauges).
- `services/`: External API integrations and data transformation services.
- `lib/financial/`: Pure functions for financial formulas (DCF, DDM, etc.).

## Philosophy

In an era of AI hype, QuantLeaf returns to the roots of value investing. It doesn't tell you *what* to buy; it gives you the mathematically correct value of an asset so you can make your own informed decision.

> "Price is what you pay. Value is what you get." - Warren Buffett
