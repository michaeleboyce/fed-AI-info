# Features

## Dashboards

### Main Dashboard (`/`)
Overview cards showing AI services, agency adoption, products, recent activity, and solution types. Quick navigation to all sections.

### AI Services (`/ai-services`)
- 615 products analyzed by Claude Haiku 4.5
- Filter by type: AI/ML, GenAI, LLM
- Search across providers, products, services
- Sort by any column
- Colored badges for AI types

### Agency AI Usage (`/agency-ai-usage`)
- 20+ federal agencies tracked
- Staff LLM usage, coding assistants, solution types
- Agency detail pages with FedRAMP service recommendations
- Confidence scoring for matches

### Products Browser (`/products`)
- All 615 FedRAMP products
- Search across all fields (including nested service lists)
- Sort by provider, offering, service count, auth date
- Pagination: 25/50/100/All
- Service model, impact level, authorization details

### Product Details (`/product/[id]`)
- Complete service lists (e.g., AWS GovCloud: 136 services)
- Recently added services highlighted
- Authorization details, contact info
- Breadcrumb navigation

## Search Capabilities

**AI Services**: Search provider, product, service names, descriptions
**Products**: Cross-field search including service lists
**Agencies**: Search by agency name or tool name (ChatGPT, Copilot)

All searches are instant, case-insensitive, with real-time results.

## Filtering & Sorting

**Filters**: AI type badges (AI/ML, GenAI, LLM), category filters
**Sorting**: Click any column header, ascending/descending toggle
**Pagination**: Configurable items per page, auto-reset on search

## AI Classification

**AI/ML** (Blue): Machine learning, computer vision, speech, analytics
**GenAI** (Teal): Text/image/code generation
**LLM** (Indigo): Large language models, NLP, chatbots

Examples: Amazon Bedrock (all three), SageMaker (AI), Azure OpenAI (GenAI, LLM)

## Technical Features

**Performance**: Server-side rendering, client-side filtering, optimized queries
**Responsive**: Mobile/tablet/desktop layouts
**Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
**Data Quality**: Official GSA API, Claude analysis, TypeScript validation

## Examples

**Find Bedrock**: Search "Bedrock" → See AWS GovCloud, AWS US East/West
**Find GenAI**: Click GenAI filter → See all generative AI services
**Most Services**: Sort products by service count → AWS at top (136-154)
**Agency Tools**: Search agency → See their AI tools + recommended FedRAMP services
