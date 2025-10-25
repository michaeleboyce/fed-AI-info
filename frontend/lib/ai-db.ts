import Database from 'better-sqlite3';
import path from 'path';

export interface AIService {
  id: number;
  product_id: string;
  product_name: string;
  provider_name: string;
  service_name: string;
  has_ai: number;
  has_genai: number;
  has_llm: number;
  relevant_excerpt: string;
  fedramp_status: string;
  impact_level: string;
  agencies: string;
  auth_date: string;
  analyzed_at: string;
}

export interface AIStats {
  total_ai_services: number;
  count_ai: number;
  count_genai: number;
  count_llm: number;
  products_with_ai: number;
  providers_with_ai: number;
}

const DB_PATH = path.join(process.cwd(), '..', 'data', 'fedramp.db');

export function getAIServices(filterType?: 'ai' | 'genai' | 'llm'): AIService[] {
  const db = new Database(DB_PATH, { readonly: true });

  let query = `
    SELECT * FROM ai_service_analysis
    WHERE has_ai = 1 OR has_genai = 1 OR has_llm = 1
  `;

  if (filterType === 'ai') {
    query = 'SELECT * FROM ai_service_analysis WHERE has_ai = 1';
  } else if (filterType === 'genai') {
    query = 'SELECT * FROM ai_service_analysis WHERE has_genai = 1';
  } else if (filterType === 'llm') {
    query = 'SELECT * FROM ai_service_analysis WHERE has_llm = 1';
  }

  query += ' ORDER BY provider_name, product_name, service_name';

  const services = db.prepare(query).all() as AIService[];
  db.close();
  return services;
}

export function getAIStats(): AIStats {
  const db = new Database(DB_PATH, { readonly: true });

  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_ai_services,
      SUM(has_ai) as count_ai,
      SUM(has_genai) as count_genai,
      SUM(has_llm) as count_llm,
      COUNT(DISTINCT product_id) as products_with_ai,
      COUNT(DISTINCT provider_name) as providers_with_ai
    FROM ai_service_analysis
    WHERE has_ai = 1 OR has_genai = 1 OR has_llm = 1
  `).get() as AIStats;

  db.close();
  return stats;
}
