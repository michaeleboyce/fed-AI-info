# AI Services Analysis

## Overview

All 615 FedRAMP products analyzed using Claude Haiku 4.5 to identify AI/ML, Generative AI, and LLM services across 10,000+ cloud services.

**Access**: http://localhost:3000/ai-services

## AI Categories

| Type | Badge | Definition | Examples |
|------|-------|------------|----------|
| **AI/ML** | Blue | Machine learning, computer vision, speech, analytics | SageMaker, Rekognition, Comprehend |
| **GenAI** | Teal | Text/image/code generation | Bedrock, Azure OpenAI, Vertex AI |
| **LLM** | Indigo | Large language models, NLP, chatbots | Bedrock (Claude/GPT), Azure OpenAI |

Services can have multiple categories (e.g., Bedrock has all three).

## Dashboard Features

**Statistics**: Total AI services, counts per type, products with AI, providers
**Filters**: All, AI/ML, GenAI, LLM (instant results)
**Search**: Provider, product, service names, descriptions
**Sorting**: Click column headers (provider, product, service, status, impact)
**Table**: Provider, Product, Service, AI Type badges, Description, Status, Impact, Actions

## Common Use Cases

**Find GenAI services**: Click GenAI filter → See Bedrock, Azure OpenAI, etc.
**Find AWS AI**: Search "Amazon" → See Bedrock, SageMaker, Comprehend, Rekognition, etc.
**Find LLMs**: Click LLM filter → See all language model services
**Find Bedrock**: Search "Bedrock" → See AWS GovCloud, AWS US East/West

## Example Results

**AWS GovCloud**: Bedrock, SageMaker, Comprehend, Rekognition, Lex, Polly, Transcribe, Translate, Kendra, Forecast
**Azure Government**: OpenAI Service, Cognitive Services, Machine Learning
**Google Cloud**: Vertex AI, Vision AI, Speech-to-Text, Natural Language

## Re-run Analysis

```bash
cd backend
python3 analyze_ai_services.py --workers 10
```

**Process**: Clears previous results → Analyzes 615 products → Stores in database
**Performance**: 2-3 minutes, 10 workers, ~$5-10 cost
**Model**: Claude Haiku 4.5 (claude-haiku-4-20250514)

## Methodology

**Input**: Provider, product name, description, complete service list (up to 150+)
**Analysis**: Claude evaluates each service for AI/ML, GenAI, LLM capabilities
**Output**: Binary flags (`has_ai`, `has_genai`, `has_llm`) + reasoning excerpt
**Quality**: Context-aware, conservative flagging, detailed explanations

## Database

**Table**: `ai_service_analysis`
**Fields**: product_id, provider, product, service, has_ai, has_genai, has_llm, relevant_excerpt, status, impact_level, analyzed_at
**Access**: Dashboard at `/ai-services` or direct SQL: `data/fedramp.db`

## Technical Details

**Script**: `backend/analyze_ai_services.py`
**Frontend**: `app/ai-services/page.tsx`, `lib/ai-db.ts`
**API**: Anthropic Claude Haiku 4.5, max_tokens=2000, temperature=0, 10 concurrent workers

## Limitations

- Based on service names/descriptions (not deep inspection)
- Conservative flagging (may miss subtle AI features)
- Point-in-time analysis (re-run for updates)
- Limited to FedRAMP-authorized services only
