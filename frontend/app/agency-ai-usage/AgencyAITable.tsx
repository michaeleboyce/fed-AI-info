'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AgencyAIUsage } from '@/lib/agency-db';

type SortField = 'agency_name' | 'has_staff_llm' | 'has_coding_assistant' | 'solution_type' | 'scope';
type SortDirection = 'asc' | 'desc';
type FilterType = 'all' | 'has_llm' | 'has_coding' | 'custom' | 'commercial';

export default function AgencyAITable({ agencies }: { agencies: AgencyAIUsage[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('agency_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize state from URL on mount
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const filter = searchParams.get('filter') as FilterType || 'all';
    const sort = searchParams.get('sort') as SortField || 'agency_name';
    const dir = searchParams.get('dir') as SortDirection || 'asc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '50', 10);

    setSearchQuery(query);
    setFilterType(filter);
    setSortField(sort);
    setSortDirection(dir);
    setCurrentPage(page);
    setItemsPerPage(perPage);
    setIsInitialized(true);
  }, [searchParams]);

  // Sync state to URL (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filterType !== 'all') params.set('filter', filterType);
    if (sortField !== 'agency_name') params.set('sort', sortField);
    if (sortDirection !== 'asc') params.set('dir', sortDirection);
    if (currentPage !== 1) params.set('page', currentPage.toString());
    if (itemsPerPage !== 50) params.set('perPage', itemsPerPage.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `/agency-ai-usage?${queryString}` : '/agency-ai-usage';

    router.replace(newUrl, { scroll: false });
  }, [searchQuery, filterType, sortField, sortDirection, currentPage, itemsPerPage, isInitialized, router]);

  // Filter by type
  const filteredByType = useMemo(() => {
    if (filterType === 'all') return agencies;
    if (filterType === 'has_llm') return agencies.filter((a) => a.has_staff_llm?.includes('Yes'));
    if (filterType === 'has_coding') return agencies.filter((a) => a.has_coding_assistant?.includes('Yes') || a.has_coding_assistant?.includes('Allowed'));
    if (filterType === 'custom') return agencies.filter((a) => a.solution_type?.includes('Custom'));
    if (filterType === 'commercial') return agencies.filter((a) => a.solution_type && (a.solution_type.includes('Azure') || a.solution_type.includes('AWS') || a.solution_type.includes('Commercial')));
    return agencies;
  }, [agencies, filterType]);

  // Filter by search query
  const filteredAgencies = useMemo(() => {
    if (!searchQuery) return filteredByType;

    const query = searchQuery.toLowerCase();
    return filteredByType.filter((agency) => {
      return (
        agency.agency_name?.toLowerCase().includes(query) ||
        agency.llm_name?.toLowerCase().includes(query) ||
        agency.solution_type?.toLowerCase().includes(query) ||
        agency.tool_name?.toLowerCase().includes(query) ||
        agency.notes?.toLowerCase().includes(query)
      );
    });
  }, [filteredByType, searchQuery]);

  // Sort agencies
  const sortedAgencies = useMemo(() => {
    const sorted = [...filteredAgencies];

    sorted.sort((a, b) => {
      let aValue: any = a[sortField] || '';
      let bValue: any = b[sortField] || '';

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredAgencies, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedAgencies.length / itemsPerPage);
  const paginatedAgencies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedAgencies.slice(start, start + itemsPerPage);
  }, [sortedAgencies, currentPage, itemsPerPage]);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Reset to page 1 when search changes
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gov-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border ${
                filterType === 'all'
                  ? 'bg-gov-navy-700 text-white border-gov-navy-700'
                  : 'bg-white text-gov-navy-900 border-gov-slate-300 hover:bg-gov-slate-50'
              }`}
            >
              All ({agencies.length})
            </button>
            <button
              onClick={() => handleFilterChange('has_llm')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border ${
                filterType === 'has_llm'
                  ? 'bg-ai-blue text-white border-ai-blue'
                  : 'bg-white text-gov-navy-900 border-gov-slate-300 hover:bg-gov-slate-50'
              }`}
            >
              Has LLM ({agencies.filter((a) => a.has_staff_llm?.includes('Yes')).length})
            </button>
            <button
              onClick={() => handleFilterChange('has_coding')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border ${
                filterType === 'has_coding'
                  ? 'bg-ai-teal text-white border-ai-teal'
                  : 'bg-white text-gov-navy-900 border-gov-slate-300 hover:bg-gov-slate-50'
              }`}
            >
              Has Coding ({agencies.filter((a) => a.has_coding_assistant?.includes('Yes') || a.has_coding_assistant?.includes('Allowed')).length})
            </button>
            <button
              onClick={() => handleFilterChange('custom')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors border ${
                filterType === 'custom'
                  ? 'bg-ai-indigo text-white border-ai-indigo'
                  : 'bg-white text-gov-navy-900 border-gov-slate-300 hover:bg-gov-slate-50'
              }`}
            >
              Custom ({agencies.filter((a) => a.solution_type?.includes('Custom')).length})
            </button>
          </div>

          {/* Search Box */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search agencies..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gov-slate-300 rounded-md focus:ring-2 focus:ring-gov-navy-500 focus:border-transparent"
            />
          </div>

          {/* Items Per Page */}
          <div className="flex items-center">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gov-slate-300 rounded-md focus:ring-2 focus:ring-gov-navy-500"
            >
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
              <option value={999999}>All</option>
            </select>
          </div>
        </div>
        <div className="mt-3 text-sm text-gov-slate-600">
          Showing {paginatedAgencies.length} of {filteredAgencies.length} agencies
          {searchQuery && ` (filtered from ${filteredByType.length} total)`}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gov-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gov-slate-100 border-b-2 border-gov-slate-200">
              <tr>
                <th
                  onClick={() => handleSort('agency_name')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gov-navy-900 cursor-pointer hover:bg-gov-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Agency</span>
                    {sortField === 'agency_name' && (
                      <span className="text-gov-navy-700">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('has_staff_llm')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gov-navy-900 cursor-pointer hover:bg-gov-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Staff LLM</span>
                    {sortField === 'has_staff_llm' && (
                      <span className="text-gov-navy-700">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('has_coding_assistant')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gov-navy-900 cursor-pointer hover:bg-gov-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Coding Assistant</span>
                    {sortField === 'has_coding_assistant' && (
                      <span className="text-gov-navy-700">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('solution_type')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gov-navy-900 cursor-pointer hover:bg-gov-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Solution Type</span>
                    {sortField === 'solution_type' && (
                      <span className="text-gov-navy-700">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('scope')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gov-navy-900 cursor-pointer hover:bg-gov-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Scope</span>
                    {sortField === 'scope' && (
                      <span className="text-gov-navy-700">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gov-navy-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gov-slate-200">
              {paginatedAgencies.map((agency, index) => (
                <tr
                  key={agency.id}
                  onClick={() => router.push(`/agency-ai-usage/${agency.slug}`)}
                  className={`cursor-pointer hover:bg-gov-slate-100 hover:border-l-4 hover:border-gov-navy-600 transition-all ${index % 2 === 0 ? 'bg-white' : 'bg-gov-slate-50/30'}`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gov-navy-900">
                    <div className="max-w-xs" title={agency.agency_name}>
                      {agency.agency_name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {agency.has_staff_llm?.includes('Yes') ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-status-success-light text-status-success-dark border border-status-success">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gov-slate-100 text-gov-slate-600 border border-gov-slate-300">
                        No
                      </span>
                    )}
                    {agency.llm_name && (
                      <div className="text-xs text-gov-slate-600 mt-1">{agency.llm_name}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {agency.has_coding_assistant?.includes('Yes') || agency.has_coding_assistant?.includes('Allowed') ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-ai-blue-light text-ai-blue-dark border border-ai-blue">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gov-slate-100 text-gov-slate-600 border border-gov-slate-300">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gov-slate-700">
                    <div className="max-w-sm truncate" title={agency.solution_type || 'N/A'}>
                      {agency.solution_type || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gov-slate-700">
                    <div className="max-w-xs truncate" title={agency.scope || 'N/A'}>
                      {agency.scope || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/agency-ai-usage/${agency.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-gov-navy-700 hover:text-gov-navy-900 font-medium underline"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 bg-gov-slate-50 border-t border-gov-slate-200 flex items-center justify-between">
            <div className="text-sm text-gov-slate-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gov-slate-300 rounded-md text-sm font-medium text-gov-navy-900 hover:bg-gov-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gov-slate-300 rounded-md text-sm font-medium text-gov-navy-900 hover:bg-gov-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
