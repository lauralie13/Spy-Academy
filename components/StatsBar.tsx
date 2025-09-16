'use client';

import { Shield, Zap, Target } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

export default function StatsBar() {
  const { rank, totalIntel, streak, getDueObjectives, objectives } = useGameStore();
  const dueCount = getDueObjectives().length;
  const masteredCount = objectives.filter(obj => obj.status === 'mastered').length;

  const getClearanceLevel = (rank: string) => {
    switch (rank) {
      case 'Operator': return 'CLASSIFIED';
      case 'Analyst': return 'CONFIDENTIAL';
      case 'Agent': return 'RESTRICTED';
      default: return 'PUBLIC';
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-sm text-slate-400">Rank</div>
              <div className="text-cyan-300 font-semibold">{rank}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <div>
              <div className="text-sm text-slate-400">Intel</div>
              <div className="text-cyan-300 font-semibold">{totalIntel.toLocaleString()}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-orange-400" />
            <div>
              <div className="text-sm text-slate-400">Streak</div>
              <div className="text-cyan-300 font-semibold">{streak}</div>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-slate-400">Clearance</div>
          <div className="text-emerald-400 font-mono text-sm">{getClearanceLevel(rank)}</div>
          <div className="text-xs text-slate-500 mt-1">
            {masteredCount} mastered • {dueCount} due
          </div>
        </div>
      </div>
    </div>
  );
}