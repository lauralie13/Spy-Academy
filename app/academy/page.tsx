'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';
import StatsBar from '@/components/StatsBar';
import { getLessons, type Lesson } from '@/lib/content';

export default function AcademyPage() {
  const router = useRouter();
  const { 
    initializeData, 
    objectives, 
    getDueObjectives,
    dyslexiaMode,
    reduceMotion 
  } = useGameStore();
  const [dueObjectives, setDueObjectives] = useState<any[]>([]);

  useEffect(() => {
    initializeData();
    setDueObjectives(getDueObjectives());
  }, [initializeData, getDueObjectives]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'mastered':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'learning':
        return <Clock className="w-5 h-5 text-cyan-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mastered':
        return 'border-emerald-500/50 bg-emerald-500/5';
      case 'learning':
        return 'border-cyan-500/50 bg-cyan-500/5';
      default:
        return 'border-slate-700/50 bg-slate-800/30';
    }
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-emerald-400';
    if (mastery >= 60) return 'text-cyan-400';
    if (mastery >= 40) return 'text-yellow-400';
    if (mastery >= 20) return 'text-orange-400';
    return 'text-red-400';
  };

  const domains = Array.from(new Set(objectives.map(obj => obj.domain)));

  // --- Lessons KB (from data/lessons.json) ---
  const lessons = useMemo(() => getLessons(), []);
  const lessonsByDomain = useMemo(() => {
    return lessons.reduce((acc: Record<string, Lesson[]>, l) => {
      (acc[l.domain] ||= []).push(l);
      return acc;
    }, {} as Record<string, Lesson[]>);
  }, [lessons]);
  const lessonDomains = useMemo(() => Object.keys(lessonsByDomain).sort(), [lessonsByDomain]);

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
          
          <h1 className="text-3xl font-bold text-cyan-300">Security Academy</h1>
        </div>

        <StatsBar />

        {dueObjectives.length > 0 && (
          <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-cyan-300 mb-2">Daily Drill Available</h3>
                <p className="text-slate-300">
                  {dueObjectives.length} objective{dueObjectives.length !== 1 ? 's' : ''} ready for review
                </p>
              </div>
              <button
                onClick={() => router.push('/review')}
                className="flex items-center space-x-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Start Drill</span>
              </button>
            </div>
          </div>
        )}

        {/* --- Security+ Lessons (Knowledge Base) --- */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-slate-200 mb-2">Security+ Lessons</h2>
          <p className="text-slate-400 text-sm mb-4">
            Start with your weakest domain from placement, or browse topics below.
          </p>
          {lessonDomains.length === 0 ? (
            <div className="text-slate-400">No lessons yet.</div>
          ) : (
            <div className="space-y-6">
              {lessonDomains.map((d) => (
                <div key={d} className="border border-slate-700/50 rounded-xl p-4 bg-slate-900/40">
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">{d}</h3>
                  <ul className="space-y-2">
                    {lessonsByDomain[d].map((l) => (
                      <li key={l.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-200">{l.title}</p>
                          {l.objectiveIds && (
                            <p className="text-slate-400 text-xs">Objectives: {l.objectiveIds.join(', ')}</p>
                          )}
                        </div>
                        <Link
                          href={`/academy/${l.id}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm"
                        >
                          Study
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        {domains.map(domain => {
          const domainObjectives = objectives.filter(obj => obj.domain === domain);
          const masteredCount = domainObjectives.filter(obj => obj.status === 'mastered').length;
          const avgMastery = domainObjectives.reduce((sum, obj) => sum + obj.mastery, 0) / domainObjectives.length;

          return (
            <div key={domain} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-slate-200">{domain}</h2>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${getMasteryColor(avgMastery)}`}>
                    {Math.round(avgMastery)}%
                  </div>
                  <div className="text-sm text-slate-400">
                    {masteredCount}/{domainObjectives.length} mastered
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domainObjectives.map(objective => {
                  const isDue = dueObjectives.some(due => due.id === objective.id);
                  
                  return (
                    <div
                      key={objective.id}
                      className={`border rounded-xl p-4 transition-all ${getStatusColor(objective.status)} ${
                        isDue ? 'ring-2 ring-cyan-400/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(objective.status)}
                            <span className="text-xs font-mono text-slate-400">{objective.id}</span>
                            {isDue && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">DUE</span>}
                          </div>
                          <h3 className="text-slate-200 font-medium mb-2">{objective.title}</h3>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Mastery</span>
                          <span className={getMasteryColor(objective.mastery)}>
                            {Math.round(objective.mastery)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              objective.mastery >= 80 ? 'bg-emerald-500' :
                              objective.mastery >= 60 ? 'bg-cyan-500' :
                              objective.mastery >= 40 ? 'bg-yellow-500' :
                              objective.mastery >= 20 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${objective.mastery}%` }}
                          />
                        </div>
                        
                        {objective.misconception && (
                          <div className="text-xs text-yellow-400 font-medium">
                            ⚠ High-confidence error detected
                          </div>
                        )}
                        
                        {objective.nextDue && (
                          <div className="text-xs text-slate-500">
                            Next: {new Date(objective.nextDue).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {objectives.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No objectives loaded</h3>
            <p className="text-slate-500 mb-6">
              Take the placement assessment to begin your learning journey.
            </p>
            <button
              onClick={() => router.push('/placement')}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl transition-colors"
            >
              Start Placement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
