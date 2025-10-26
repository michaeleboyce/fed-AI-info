# Quick Start

## Run the App

```bash
cd frontend
pnpm install
pnpm dev
```

Open http://localhost:3000

## Main URLs

- `/` - Dashboard
- `/ai-services` - AI services catalog
- `/agency-ai-usage` - Agency AI tracking
- `/products` - All products
- `/product/[id]` - Product details

## Common Tasks

**Find AI services**: Go to `/ai-services`, search or filter by type
**Find products**: Go to `/products`, search provider/offering
**View agencies**: Go to `/agency-ai-usage`, click for details
**Sort data**: Click column headers
**Change page size**: Use dropdown (25/50/100/All)

## Search Examples

```
"Bedrock"     → Find Amazon Bedrock services
"Amazon"      → All AWS products/services
"Microsoft"   → All Microsoft products
"ChatGPT"     → Agencies using ChatGPT
```

## Update Data

```bash
cd backend
python3 fetch_json.py                      # Fetch latest
python3 analyze_ai_services.py --workers 10  # Re-analyze AI
```

## Quick Reference

| Task | Action |
|------|--------|
| Search | Type in search box |
| Filter AI | Click badge button (AI/ML, GenAI, LLM) |
| Sort | Click column header |
| Details | Click name or "View Details" |
| Navigate | Use breadcrumbs |

## Example Queries

**"Which products offer LLMs?"** → `/ai-services`, click LLM filter
**"What's in AWS GovCloud?"** → `/products`, search "GovCloud", view details
**"Who uses Copilot?"** → `/agency-ai-usage`, search "Copilot"
