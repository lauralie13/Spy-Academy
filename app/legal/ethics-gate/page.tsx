/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, AlertTriangle } from 'lucide-react';
import { useGameStore } from '@/store/useGameStore';

export default function EthicsGatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = searchParams.get('return') || '/missions';
  
  const { markEthicsAccepted, dyslexiaMode, reduceMotion } = useGameStore();
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    if (!agreed) return;
    
    markEthicsAccepted();
    router.push(returnPath);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${dyslexiaMode ? 'dyslexia-font' : ''} ${reduceMotion ? 'reduce-motion' : ''}`}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900/70 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Shield className="w-12 h-12 text-red-400" />
              <AlertTriangle className="w-12 h-12 text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-red-300 mb-2">Ethics Gate</h1>
            <p className="text-slate-300">Authorization Required for Mission Access</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-cyan-300 mb-4">Training Protocol Agreement</h2>
            
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong className="text-cyan-400">ArcLight Security Academy</strong> provides cybersecurity training 
                through simulated environments and scenarios. By proceeding, you acknowledge and agree to the following:
              </p>
              
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h3 className="text-cyan-400 font-semibold mb-2">Authorized Use Only</h3>
                <ul className="space-y-1 text-xs">
                  <li>• All missions contain simulated data and scenarios only</li>
                  <li>• No real-world systems, networks, or organizations are involved</li>
                  <li>• Techniques learned are for defensive purposes and authorized testing only</li>
                  <li>• You will not use knowledge gained for unauthorized access or malicious purposes</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h3 className="text-emerald-400 font-semibold mb-2">Educational Purpose</h3>
                <ul className="space-y-1 text-xs">
                  <li>• Training is designed to prepare you for CompTIA Security+ certification</li>
                  <li>• Focus on defensive cybersecurity practices and incident response</li>
                  <li>• Emphasis on legal, ethical, and responsible security practices</li>
                  <li>• All activities comply with applicable laws and regulations</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg">
                <h3 className="text-yellow-400 font-semibold mb-2">Professional Responsibility</h3>
                <ul className="space-y-1 text-xs">
                  <li>• You will respect others' privacy, data, and systems</li>
                  <li>• You will follow responsible disclosure practices for any vulnerabilities discovered</li>
                  <li>• You understand the legal and ethical implications of cybersecurity work</li>
                  <li>• You commit to using security knowledge for protection, not exploitation</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-600 rounded-xl p-4 mb-6">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 mt-1 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500"
              />
              <div className="text-sm">
                <span className="text-slate-200 font-medium">I have read and agree to these terms.</span>
                <p className="text-slate-400 text-xs mt-1">
                  I understand that this training is for educational purposes and commit to using 
                  cybersecurity knowledge responsibly and ethically.
                </p>
              </div>
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 py-3 px-6 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!agreed}
              className="flex-1 py-3 px-6 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 disabled:text-slate-400 text-white font-semibold rounded-xl transition-colors"
            >
              Enter Academy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
