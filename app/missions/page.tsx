'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import MissionCard from '@/components/MissionCard';
import StatsBar from '@/components/StatsBar';

export default function MissionsPage() {
  const router = useRouter();
  const { 
    initializeData, 
    missions, 
    ethicsAccepted,
    getCompletedMissions,
    dyslexiaMode,
    reduceMotion 
  } = useGameStore();

  const completedMissions = getCompletedMissions();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const isMissionUnlocked = (mission: any) => {
    if (mission.unlocks.length === 0) return true; // No prerequisites
    return mission.unlocks.every((reqId: string) => 
      completedMissions.includes(reqId)
    );
  };

  const handleMissionClick = (missionId: string) => {
    if (!ethicsAccepted) {
      router.push('/legal/ethics-gate?return=/mission/' + missionId);
    } else {
      router.push('/mission/' + missionId);
    }
  };

  return (
    <div className={`min-h-screen p-4 ${dyslexiaMode ? 'dyslexia-font' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <h1 className="text-3xl font-bold text-orange-300">Mission Operations</h1>
        </div>

        <StatsBar />

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-200 mb-4">Available Missions</h2>
          <p className="text-slate-400 mb-6">
            Apply your Security+ knowledge in realistic scenarios. Complete missions to unlock advanced operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map(mission => (
            <MissionCard
              key={mission.id}
              mission={mission}
              isLocked={!isMissionUnlocked(mission)}
              isCompleted={completedMissions.includes(mission.id)}
              onClick={() => isMissionUnlocked(mission) && handleMissionClick(mission.id)}
            />
          ))}
        </div>

        {missions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl text-slate-600 mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No missions available</h3>
            <p className="text-slate-500">
              Missions are loading or not yet unlocked.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}