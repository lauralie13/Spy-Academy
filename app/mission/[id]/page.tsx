'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getMissions, type Mission } from '@/lib/content';

export default function MissionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [mission, setMission] = useState<Mission | null>(null);

  useEffect(() => {
    const missions = getMissions();
    const foundMission = missions.find(m => m.id === params.id);
    setMission(foundMission || null);
  }, [params.id]);

  if (!mission) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/missions')}
              className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Missions</span>
            </button>
          </div>
          
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-slate-200 mb-4">Mission Not Found</h2>
            <p className="text-slate-400">The requested mission could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/missions')}
            className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Missions</span>
          </button>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-cyan-300 mb-4">{mission.title}</h1>
          <p className="text-slate-300 text-lg mb-6">{mission.lore}</p>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4">Mission Briefing</h3>
            <p className="text-slate-400 mb-4">
              This mission is currently under development. Check back soon for the full interactive experience.
            </p>
            
            <div className="space-y-2">
              <div className="text-sm text-slate-500">
                <strong>Type:</strong> {mission.type}
              </div>
              <div className="text-sm text-slate-500">
                <strong>Objectives:</strong> {mission.objectives.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}