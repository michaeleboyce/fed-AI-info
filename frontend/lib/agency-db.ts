import Database from 'better-sqlite3';
import path from 'path';

export interface AgencyAIUsage {
  id: number;
  agency_name: string;
  agency_category: string;
  has_staff_llm: string | null;
  llm_name: string | null;
  has_coding_assistant: string | null;
  scope: string | null;
  solution_type: string | null;
  non_public_allowed: string | null;
  other_ai_present: string | null;
  tool_name: string | null;
  tool_purpose: string | null;
  notes: string | null;
  sources: string | null;
  analyzed_at: string;
  slug: string;
}

export interface AgencyServiceMatch {
  product_id: string;
  provider_name: string;
  product_name: string;
  confidence: string;
  match_reason: string;
}

export interface AgencyStats {
  total_agencies: number;
  agencies_with_llm: number;
  agencies_with_coding: number;
  agencies_custom_solution: number;
  agencies_commercial_solution: number;
  total_matches: number;
  high_confidence_matches: number;
}

const DB_PATH = path.join(process.cwd(), '..', 'data', 'fedramp.db');

export function getAgencies(category?: 'staff_llm' | 'specialized'): AgencyAIUsage[] {
  const db = new Database(DB_PATH, { readonly: true });

  let query = 'SELECT * FROM agency_ai_usage';

  if (category) {
    query += ' WHERE agency_category = ?';
  }

  query += ' ORDER BY agency_name';

  const agencies = category
    ? db.prepare(query).all(category) as AgencyAIUsage[]
    : db.prepare(query).all() as AgencyAIUsage[];

  db.close();
  return agencies;
}

export function getAgencyBySlug(slug: string): AgencyAIUsage | null {
  const db = new Database(DB_PATH, { readonly: true });

  const agency = db.prepare('SELECT * FROM agency_ai_usage WHERE slug = ?').get(slug) as AgencyAIUsage | undefined;

  db.close();
  return agency || null;
}

export function getAgencyMatches(agencyId: number): AgencyServiceMatch[] {
  const db = new Database(DB_PATH, { readonly: true });

  const matches = db.prepare(`
    SELECT product_id, provider_name, product_name, confidence, match_reason
    FROM agency_service_matches
    WHERE agency_id = ?
    ORDER BY
      CASE confidence
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
      END,
      provider_name
  `).all(agencyId) as AgencyServiceMatch[];

  db.close();
  return matches;
}

export function getAgencyStats(): AgencyStats {
  const db = new Database(DB_PATH, { readonly: true });

  const stats = db.prepare(`
    SELECT
      COUNT(DISTINCT id) as total_agencies,
      SUM(CASE WHEN has_staff_llm LIKE '%Yes%' THEN 1 ELSE 0 END) as agencies_with_llm,
      SUM(CASE WHEN has_coding_assistant LIKE '%Yes%' OR has_coding_assistant LIKE '%Allowed%' THEN 1 ELSE 0 END) as agencies_with_coding,
      SUM(CASE WHEN solution_type LIKE '%Custom%' THEN 1 ELSE 0 END) as agencies_custom_solution,
      SUM(CASE WHEN solution_type LIKE '%Commercial%' OR solution_type LIKE '%Azure%' OR solution_type LIKE '%AWS%' THEN 1 ELSE 0 END) as agencies_commercial_solution,
      (SELECT COUNT(*) FROM agency_service_matches) as total_matches,
      (SELECT COUNT(*) FROM agency_service_matches WHERE confidence = 'high') as high_confidence_matches
    FROM agency_ai_usage
    WHERE agency_category = 'staff_llm'
  `).get() as AgencyStats;

  db.close();
  return stats;
}

export function searchAgencies(query: string): AgencyAIUsage[] {
  const db = new Database(DB_PATH, { readonly: true });

  const searchTerm = `%${query.toLowerCase()}%`;

  const agencies = db.prepare(`
    SELECT * FROM agency_ai_usage
    WHERE
      LOWER(agency_name) LIKE ? OR
      LOWER(llm_name) LIKE ? OR
      LOWER(solution_type) LIKE ? OR
      LOWER(tool_name) LIKE ? OR
      LOWER(notes) LIKE ?
    ORDER BY agency_name
  `).all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm) as AgencyAIUsage[];

  db.close();
  return agencies;
}
