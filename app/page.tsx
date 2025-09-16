'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Brain, Target, Settings } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import StatsBar from '@/components/StatsBar';
import HeatmapProgress from '@/components/HeatmapProgress';
import Toggle from '@/components/Toggle';

export default function Home() {
  const router = useRouter();
  const { 
    initializeData, 
    objectives,
    dyslexiaMode,
    reduceMotion,
    toggleDyslexiaMode,
    toggleReduceMotion 
  } = useGameStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <div className={`min-h-screen p-4 ${dyslexiaMode ? 'dyslexia-font' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="w-12 h-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              ArcLight
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-2">Security Academy</p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Welcome to ArcLight, the premier cybersecurity training facility. Master CompTIA Security+ 
            through immersive simulations and adaptive learning protocols.
          </p>
        </div>

        <StatsBar />

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <HeatmapProgress />
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </h3>
            <div className="space-y-3">
              <Toggle
                enabled={dyslexiaMode}
                onChange={toggleDyslexiaMode}
                label="Dyslexia-friendly"
                description="Use readable fonts and spacing"
              />
              <Toggle
                enabled={reduceMotion}
                onChange={toggleReduceMotion}
                label="Reduce motion"
                description="Minimize animations and transitions"
              />
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/placement')}
            className="group bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-400/50 rounded-2xl p-8 text-left transition-all hover:shadow-lg hover:shadow-cyan-500/10"
          >
            <Brain className="w-10 h-10 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-semibold text-cyan-300 mb-3">Start Placement</h3>
            <p className="text-slate-400 mb-4">
              Take our adaptive assessment to identify your strengths and weaknesses across all Security+ domains.
            </p>
            <div className="text-cyan-400 font-medium">Begin Assessment →</div>
          </button>

          <button
            onClick={() => router.push('/academy')}
            className="group bg-slate-900/50 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-400/50 rounded-2xl p-8 text-left transition-all hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <Shield className="w-10 h-10 text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-semibold text-emerald-300 mb-3">Continue Academy</h3>
            <p className="text-slate-400 mb-4">
              Master Security+ objectives through spaced repetition and adaptive learning protocols.
            </p>
            <div className="text-emerald-400 font-medium">Enter Academy →</div>
          </button>

          <button
            onClick={() => router.push('/missions')}
            className="group bg-slate-900/50 backdrop-blur-sm border border-orange-500/20 hover:border-orange-400/50 rounded-2xl p-8 text-left transition-all hover:shadow-lg hover:shadow-orange-500/10"
          >
            <Target className="w-10 h-10 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-semibold text-orange-300 mb-3">Missions</h3>
            <p className="text-slate-400 mb-4">
              Apply your knowledge in realistic scenarios. Analyze logs, build architectures, and defend networks.
            </p>
            <div className="text-orange-400 font-medium">View Missions →</div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            ArcLight Security Academy • Authorized Training Protocol SY0-701 • All scenarios are simulated
          </p>
        </div>
      </div>
    </div>
  );
}