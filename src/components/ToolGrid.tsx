import React, { useState, useRef, useEffect } from 'react';
import { FinancialPlatform } from '../types';
import { ToolCard } from './ToolCard';
import { ChevronDown, Sparkles, FilterX, ShieldCheck } from 'lucide-react';

export type SortOption = 'newest' | 'rating' | 'upvotes' | 'picks' | 'alphabetical' | 'yield';

interface ToolGridProps {
  platforms: FinancialPlatform[];
  totalDatabaseCount: number;
  upvotedIds: Set<string>;
  onUpvote: (e: React.MouseEvent, platformId: string) => void;
  onSelectPlatform: (platform: FinancialPlatform) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  comparedIds?: Set<string>;
  onToggleCompare?: (e: React.MouseEvent, platformId: string) => void;
  userRatings?: Record<string, number>;
  onOpenReview?: (e: React.MouseEvent, platform: FinancialPlatform) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  platforms,
  totalDatabaseCount,
  upvotedIds,
  onUpvote,
  onSelectPlatform,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
  comparedIds = new Set(),
  onToggleCompare,
  userRatings = {},
  onOpenReview,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest',
    rating: 'Highest Rated ★',
    upvotes: 'Most Upvoted',
    picks: "Editor's Picks",
    yield: 'Highest APY / Yield',
    alphabetical: 'Name (A–Z)',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Subheader: Showing count + Sort dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-slate-200/60 dark:border-slate-800/80 mb-6">
        {/* Count display matching screenshot */}
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing <span className="font-bold text-slate-900 dark:text-white">1–{platforms.length}</span> of{' '}
          <span className="font-bold text-slate-900 dark:text-white">{totalDatabaseCount}</span> verified platforms
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FilterX className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}

          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
            >
              <span>{sortLabels[sortBy]}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-30 text-xs animate-in fade-in slide-in-from-top-1">
                {(['newest', 'upvotes', 'picks', 'yield', 'alphabetical'] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onSortChange(option);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer ${
                      sortBy === option
                        ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{sortLabels[option]}</span>
                    {sortBy === option && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Platform Cards (3 columns on desktop, exactly like screenshot) */}
      {platforms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {platforms.map((platform) => (
            <ToolCard
              key={platform.id}
              platform={platform}
              hasUpvoted={upvotedIds.has(platform.id)}
              onUpvote={onUpvote}
              onSelect={onSelectPlatform}
              isCompared={comparedIds.has(platform.id)}
              onToggleCompare={onToggleCompare}
              currentUserRating={userRatings[platform.id]}
              onOpenReview={onOpenReview}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto my-12">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-4">
            <FilterX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No platforms found</h3>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            No financial platforms matched your selected criteria. Try removing filters or searching a different asset class.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
