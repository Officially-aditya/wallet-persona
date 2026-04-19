'use client';

import React from 'react';

type PersonaProps = {
  archetype: string;
  roast: string;
  flags: string[];
  degenScore: number;
  missedGains: string;
  verdict: string;
  stats: any;
  walletAddress: string;
};

export const PersonaCard = ({
  archetype,
  roast,
  flags,
  degenScore,
  missedGains,
  verdict,
  stats,
  walletAddress,
}: PersonaProps) => {
  
  let verdictColor = 'bg-gray-600 text-white';
  const v = (verdict || '').toLowerCase();
  if (v.includes('degenerate')) verdictColor = 'bg-red-600 text-white';
  else if (v.includes('coward')) verdictColor = 'bg-yellow-500 text-yellow-950';
  else if (v.includes('disciplined')) verdictColor = 'bg-green-600 text-white';
  else if (v.includes('chaotic')) verdictColor = 'bg-orange-600 text-white';
  
  return (
    <div id="persona-card" className="bg-[#0f172a] border border-slate-800 rounded-xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 right-0 p-4 opacity-10"></div>
      
      <div className="text-center mb-6 flex flex-col items-center">
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-slate-500 mb-3">WALLET PERSONA / FOUR.MEME</h3>
        
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${verdictColor}`}>
          {verdict || 'UNKNOWN'}
        </div>
        
        <h1 className="text-4xl font-extrabold text-white leading-tight uppercase tracking-tight text-center">{archetype}</h1>
      </div>
      
      <div className="bg-slate-950/50 rounded-lg p-5 mb-6 border border-amber-900/30 w-full">
        <p className="text-amber-400 italic text-lg text-center font-serif">"{roast}"</p>
      </div>
      
      <div className="h-px bg-slate-800 w-full mb-6"></div>
      
      <div className="flex flex-row w-full gap-4 mb-6 justify-center">
        <div className="flex-1 bg-slate-800/50 rounded p-3 text-center border border-slate-700/50">
          <div className="text-xs text-slate-400 mb-1">Degen Score</div>
          <div className="text-2xl font-bold text-white">{degenScore}/100</div>
        </div>
        <div className="flex-1 bg-slate-800/50 rounded p-3 text-center border border-slate-700/50">
          <div className="text-xs text-slate-400 mb-1">Dead Bags</div>
          <div className="text-2xl font-bold text-rose-400">{stats?.tokensHeldToZero || 0}</div>
        </div>
        <div className="flex-1 bg-slate-800/50 rounded p-3 text-center border border-slate-700/50">
          <div className="text-xs text-slate-400 mb-1">Avg Hold</div>
          <div className="text-2xl font-bold text-sky-400">{stats?.avgHoldDuration || 0}h</div>
        </div>
      </div>
      
      <div className="mb-6 w-full">
        <ul className="space-y-3">
          {flags.map((flag, i) => (
            <li key={i} className="text-slate-300 text-sm flex items-start leading-relaxed">
              <span className="text-indigo-400 mr-2 mt-0.5 font-bold">•</span>
              {flag}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="h-px bg-slate-800 w-full mb-4"></div>
      
      <div className="w-full flex justify-between items-center text-xs opacity-75">
        <div className="font-mono text-slate-400">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
        <div className="text-slate-500 font-semibold tracking-wide">
          analyzed by Wallet Persona x Four.meme
        </div>
      </div>
    </div>
  );
};
