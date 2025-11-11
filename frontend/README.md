# SGEO Dashboard - Frontend

Next.js 14 web application for SGEO LLM monitoring and analytics.

## Getting Started

### Prerequisites

- Node.js 20.x LTS
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Features

- **Dashboard Overview**: Real-time metrics and KPIs
- **E-E-A-T Scoring**: Source quality assessment
- **LLM Comparison**: Performance across 5 LLM systems
- **Trends Analysis**: Historical data visualization
- **Topics Monitoring**: 20 priority topics tracking
- **Alerts & Recommendations**: AI-powered insights

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Recharts (for charts)
- shadcn/ui components

## Project Structure

```
frontend/
├── app/                  # Next.js pages (App Router)
├── components/
│   ├── ui/              # Base UI components
│   └── dashboard/       # Dashboard-specific components
├── lib/                 # Utilities and helpers
├── styles/              # Global styles
└── public/              # Static assets
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
