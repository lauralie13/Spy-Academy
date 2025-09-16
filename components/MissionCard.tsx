'use client';

import { Lock, CheckCircle, Clock } from 'lucide-react';
import { type Mission } from '@/lib/content';

interface MissionCardProps {
  mission: Mission;
  isLocked: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

export default function MissionCard({ mission, isLocked, isCompleted, onClick }: MissionCardProps) {
  const getDifficultyColor = (type: string) => {
    switch (type) {
      case 'log-hunt': return 'text-cyan-400';
      case 'zone-builder': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'log-hunt': return 'Log Analysis';
      case 'zone-builder': return 'Architecture';
      default: return 'Unknown';
    }
  };

  return (
    <div
      className={`bg-slate-900/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
        isLocked
          ? 'border-slate-700/50 opacity-60'
          : isCompleted
          ? 'border-emerald-500/50 hover:border-emerald-400/70 hover:shadow-lg hover:shadow-emerald-500/10'
          : 'border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-cyan-300 mb-2">{mission.title}</h3>
          <p className="text-slate-400 text-sm mb-3">{mission.lore}</p>
        </div>
        <div className="flex-shrink-0 ml-4">
          {isLocked ? (
            <Lock className="w-6 h-6 text-slate-500" />
          ) : isCompleted ? (
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          ) : (
            <Clock className="w-6 h-6 text-cyan-400" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${getDifficultyColor(mission.type)}`}>
          {getTypeLabel(mission.type)}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500">
            {mission.objectives.length} objective{mission.objectives.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {!isLocked && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex flex-wrap gap-2">
            {mission.objectives.slice(0, 2).map(objId => (
              <span
                key={objId}
                className="px-2 py-1 bg-slate-800/50 text-slate-300 text-xs rounded-full"
              >
                {objId}
              </span>
            ))}
            {mission.objectives.length > 2 && (
              <span className="px-2 py-1 bg-slate-800/50 text-slate-400 text-xs rounded-full">
                +{mission.objectives.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}