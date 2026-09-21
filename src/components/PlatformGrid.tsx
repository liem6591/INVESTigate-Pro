import React from 'react';
import { Platform } from '../types';
import { PlatformCard } from './PlatformCard';
import { Layers, ShieldCheck, ArrowUpDown } from 'lucide-react';

interface PlatformGridProps {
  platforms: Platform[];
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onViewDossier: (platform: Platform) => void;
  selectedCategory: string;
}

export const PlatformGrid: React.FC<PlatformGridProps> = ({
  platforms,
  compareIds,
  onToggleCompare,
  onViewDossier,
  selectedCategory,
}) => {
  return (
    <section id="dossier-grid" className="py-12 bg-[#F1EEE4] border-b border-[#D8D2C0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-[#D8D2C0] gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#57534E]">
              <Layers className="w-3.5 h-3.5 text-[#B8923F]" />
              <span>Platform Investigation Dossiers</span>
            </div>
            <h2 className="font-serif-headline text-2xl sm:text-3xl font-semibold text-[#101826] mt-1.5">
              Audited Platform Catalog
            </h2>
          </div>

          <div className="text-xs font-mono text-[#57534E]">
            Displaying {platforms.length} audited financial institutions
          </div>
        </div>

        {/* Cards Grid */}
        {platforms.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#D8D2C0]">
            <p className="text-[#57534E] font-sans">
              No platform dossiers found matching your current filter. Try resetting your search or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                isCompared={compareIds.includes(platform.id)}
                onToggleCompare={onToggleCompare}
                onViewDossier={onViewDossier}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
