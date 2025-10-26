# FedRAMP AI Services Dashboard

Comprehensive web application tracking AI adoption in federal government through FedRAMP-authorized services and agency implementations.

## What It Does

1. **AI Services Catalog** - Claude Haiku 4.5 analysis of 615 FedRAMP products identifying AI/ML, Generative AI, and LLM services
2. **Agency AI Tracking** - Database of 20+ federal agencies and their AI tool adoption
3. **Products Browser** - Searchable catalog of all FedRAMP-authorized cloud services
4. **Smart Matching** - Algorithm matching agencies to compatible FedRAMP services

## Quick Start

```bash
cd frontend
pnpm install
pnpm dev
```

Open http://localhost:3000

## Main Features

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/` | Overview with statistics cards |
| AI Services | `/ai-services` | AI/ML/GenAI/LLM services catalog |
| Agencies | `/agency-ai-usage` | Federal agency AI adoption |
| Products | `/products` | All 615 FedRAMP products |
| Details | `/product/[id]` | Individual product pages |

**Key Capabilities**:
- Search across 10,000+ services
- Filter by AI type (AI/ML, GenAI, LLM)
- Sort by provider, product, service count, dates
- Agency detail pages with FedRAMP recommendations

## Tech Stack

**Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, better-sqlite3
**Backend**: Python 3.8+, Anthropic Claude Haiku 4.5, SQLite
**Data Source**: Official GSA JSON API (615 products, 40+ fields each)

## Architecture

```
backend/          # Python data pipeline
├── fetch_json.py           # Fetch from GSA API
├── analyze_ai_services.py  # Claude AI analysis
├── match_agencies_to_services.py  # Smart matching
└── db.py                   # SQLite operations

data/
├── fedramp_products.json   # 615 products from GSA
└── fedramp.db             # SQLite database

frontend/         # Next.js application
├── app/                    # Pages and routes
├── components/             # Reusable components
└── lib/                    # Database utilities
```

## Database

**Tables**:
- `products` - All FedRAMP product data (615 records)
- `ai_service_analysis` - Claude's AI classifications
- `agency_ai_usage` - Federal agency AI adoption
- `agency_service_matches` - Agency-to-service recommendations
- `product_ai_analysis_runs` - Analysis job history

## Data Updates

```bash
# Fetch latest FedRAMP data
cd backend
python3 fetch_json.py

# Re-run AI analysis (~2-3 minutes)
python3 analyze_ai_services.py --workers 10
```

## AI Analysis

Uses Claude Haiku 4.5 to classify services:
- **AI/ML** (Blue): Machine learning, computer vision, speech recognition
- **GenAI** (Teal): Text/image/code generation
- **LLM** (Indigo): Large language models, NLP

**Performance**: 615 products in 2-3 minutes, ~$5-10 cost, 10 concurrent workers

## Deployment (Vercel)

- **Framework**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `pnpm run build`
- **Install Command**: `pnpm install`
- **Output Directory**: `.next` (default)

**Note**: SQLite database must be included or migrate to PostgreSQL for production.

## Documentation

- **README.md** (this file): Overview and setup
- **FEATURES.md**: Detailed feature list
- **QUICK_START.md**: Command reference
- **AI_SERVICES_GUIDE.md**: AI analysis methodology

## Data Source

Official GSA FedRAMP API: `https://raw.githubusercontent.com/GSA/marketplace-fedramp-gov-data/refs/heads/main/data.json`

## License

Personal/educational use. FedRAMP data is public domain.
