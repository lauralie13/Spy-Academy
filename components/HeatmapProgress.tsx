'use client';

import { useGameStore } from '@/store/useGameStore';

interface HeatmapProgressProps {
  domainProfiles?: {
    domain: string;
    mastery: number;
  }[];
}

export default function HeatmapProgress({ domainProfiles }: HeatmapProgressProps) {
  const { objectives } = useGameStore();

  // Use provided profiles or compute from objectives
  const profiles = domainProfiles || Array.from(new Set(objectives.map(o => o.domain))).map(domain => {
    const domainObjectives = objectives.filter(o => o.domain === domain);
    const avgMastery = domainObjectives.reduce((sum, obj) => sum + obj.mastery, 0) / domainObjectives.length;
    return { domain, mastery: avgMastery };
  });

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'bg-emerald-500';
    if (mastery >= 60) return 'bg-cyan-500';
    if (mastery >= 40) return 'bg-yellow-500';
    if (mastery >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getMasteryText = (mastery: number) => {
    if (mastery >= 80) return 'Mastered';
    if (mastery >= 60) return 'Proficient';
    if (mastery >= 40) return 'Learning';
    if (mastery >= 20) return 'Beginner';
    return 'Untrained';
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-cyan-300 mb-4">Domain Mastery</h3>
      <div className="space-y-4">
        {profiles.map(profile => (
          <div key={profile.domain} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 text-sm font-medium">
                {profile.domain.replace(/^(.*?) /, '')} 
              </span>
              <span className="text-slate-400 text-sm">
                {Math.round(profile.mastery)}% • {getMasteryText(profile.mastery)}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getMasteryColor(profile.mastery)}`}
                style={{ width: `${profile.mastery}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}