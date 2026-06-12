export interface Holding {
  ticker: string;
  name: string;
  shares: number;
  costBasis: number; // per share at time of purchase
  amountInvested: number; // dollar amount invested
  description: string;
  logoUrl: string;
  accentColor: string;
}

export const PORTFOLIO_META = {
  name: "Daphne",
  parents: "Karthik & Kumi",
  startDate: "June 12, 2026",
  birthYear: 2025,
};

// $10 invested in ELF, COKE, DIS — fractional shares
// VTI: $50 invested (update this if different)
export const HOLDINGS: Holding[] = [
  {
    ticker: "VTI",
    name: "Vanguard Total Stock Market ETF",
    shares: parseFloat((50 / 280.0).toFixed(6)),  // $50 ÷ ~$280
    costBasis: 280.0,
    amountInvested: 50,
    description: "Broad US market index fund",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Vanguard_Group_logo.svg/1024px-Vanguard_Group_logo.svg.png",
    accentColor: "#F4846A",
  },
  {
    ticker: "ELF",
    name: "e.l.f. Beauty",
    shares: parseFloat((10 / 62.0).toFixed(6)),   // $10 ÷ ~$62
    costBasis: 62.0,
    amountInvested: 10,
    description: "Cosmetics and beauty products",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/E.l.f._Cosmetics_logo.svg/1024px-E.l.f._Cosmetics_logo.svg.png",
    accentColor: "#C9A0DC",
  },
  {
    ticker: "COKE",
    name: "Coca-Cola Consolidated",
    shares: parseFloat((10 / 700.0).toFixed(6)),  // $10 ÷ ~$700
    costBasis: 700.0,
    amountInvested: 10,
    description: "Beverage bottling and distribution",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/1024px-Coca-Cola_logo.svg.png",
    accentColor: "#F4846A",
  },
  {
    ticker: "DIS",
    name: "The Walt Disney Company",
    shares: parseFloat((10 / 95.0).toFixed(6)),   // $10 ÷ ~$95
    costBasis: 95.0,
    amountInvested: 10,
    description: "Global entertainment and media",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Disney_wordmark.svg/1024px-Disney_wordmark.svg.png",
    accentColor: "#7EB8F7",
  },
];

export const TOTAL_INVESTED = HOLDINGS.reduce(
  (sum, h) => sum + h.amountInvested,
  0
);
