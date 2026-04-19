'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [isGhost, setIsGhost] = useState(false);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
    const savedPersona = localStorage.getItem('persona');
    if (savedPersona) {
      try {
        const p = JSON.parse(savedPersona);
        if (p.archetype === 'GHOST WALLET') setIsGhost(true);
      } catch (e) {}
    }
    const savedStats = localStorage.getItem('stats');
    if (savedStats) {
      try { setStats(JSON.parse(savedStats)); } catch (e) {}
    }
    const savedDemo = localStorage.getItem('isDemoMode');
    if (savedDemo === 'true') {
      setIsDemoMode(true);
    }
  }, []);

  return (
    <div className="bg-[#121317] text-[#e3e2e7] font-[family-name:var(--font-body)] flex flex-col min-h-screen overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 bg-[#121317]/60 backdrop-blur-xl bg-gradient-to-b from-[#121317] to-transparent shadow-[0_8px_32px_rgba(108,255,50,0.06)]">
        <div className="flex justify-between items-center px-12 h-20 w-full max-w-full mx-auto">
          <Link href="/" className="text-2xl font-black italic tracking-tighter text-[#6CFF32] font-['Space_Grotesk'] uppercase text-left">
            WALLET PERSONA
          </Link>
          <nav className="hidden md:flex space-x-8 font-['Space_Grotesk'] tracking-tighter uppercase font-bold">
            <Link href="/dashboard" className="text-gray-400 hover:text-white hover:bg-[#6CFF32]/10 transition-all active:scale-95 duration-200 py-2 px-3 rounded cursor-pointer">Dashboard</Link>
            <Link href="/history" className="text-gray-400 hover:text-white hover:bg-[#6CFF32]/10 transition-all active:scale-95 duration-200 py-2 px-3 rounded cursor-pointer">History</Link>
            <Link href="/analytics" className="text-gray-400 hover:text-white hover:bg-[#6CFF32]/10 transition-all active:scale-95 duration-200 py-2 px-3 rounded cursor-pointer">Analytics</Link>
          </nav>
          <div className="flex items-center space-x-6"><ConnectButton /></div>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 w-full max-w-5xl mx-auto flex flex-col items-center relative z-10">
        <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-[#e3e2e7] w-full text-center">Protocol Analytics</h1>
        <p className="text-[#bccbb0] w-full text-center max-w-2xl font-['Inter'] mb-12">
          Your full on-chain behavioral data matrix. 
        </p>

        {mounted && stats ? (
          isGhost ? (
            <div className="text-center py-24 w-full bg-[#1a1b1f] rounded-xl border border-[#ffb4ab]/30 flex flex-col items-center justify-center gap-4">
              <span className="text-6xl">🕸️</span>
              <p className="text-2xl text-gray-200 font-['Space_Grotesk'] font-bold">Zero Data. Zero Trades.</p>
              <p className="text-[#ffb4ab] font-['Space_Grotesk'] max-w-md">You need to spend a dime to get lime. It's truly impressive how little you've done. Are you allergic to transaction fees?</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {/* Stat Card 1 */}
              <div className="bg-[#1e1f23] border border-[#3d4b36]/30 rounded-xl p-8 pt-10 relative overflow-hidden group hover:border-[#6cff32]/30 transition-all duration-300">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#6cff32]/10 rounded-full blur-[40px]"></div>
              <div className="font-['Space_Grotesk'] text-xs text-[#bccbb0] uppercase tracking-widest mb-2 relative z-10">Total Trades</div>
              <div className="font-['Space_Grotesk'] text-5xl font-black text-white tracking-tighter relative z-10">{isDemoMode ? '1,337' : stats?.totalTrades || 0}</div>
              <div className="mt-4 flex items-center gap-2 text-[#6cff32] font-['Inter'] text-sm relative z-10">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>{isDemoMode ? '+420% ROI' : `${stats?.totalBuys || 0} buys`}</span>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-[#1e1f23] border border-[#3d4b36]/30 rounded-xl p-8 pt-10 relative overflow-hidden hover:border-[#ffb4ab]/30 transition-all duration-300">
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-[#ffb4ab]/10 rounded-full blur-[40px]"></div>
              <div className="font-['Space_Grotesk'] text-xs text-[#bccbb0] uppercase tracking-widest mb-2 relative z-10">Longest Hold</div>
              <div className="font-['Space_Grotesk'] text-5xl font-black text-white tracking-tighter relative z-10">{isDemoMode ? '142 D' : `${stats?.avgHoldDuration || 0}h`}</div>
              <div className="mt-4 flex items-center gap-2 text-[#bccbb0] font-['Inter'] text-sm relative z-10">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>Avg. hold {isDemoMode ? '12 hours' : `${stats?.avgHoldDuration || 0} hours`}</span>
              </div>
            </div>

            {/* Wide Stat Card */}
            <div className="bg-[#1a1b1f] border border-[#3d4b36]/30 rounded-xl p-8 sm:col-span-2 relative overflow-hidden text-left">
              <div className="font-['Space_Grotesk'] text-xs text-gray-500 uppercase tracking-widest mb-6 relative z-10 text-center border-b border-[#3d4b36]/30 pb-4">On-Chain Vibe Check</div>
              <div className="space-y-6 relative z-10 max-w-2xl mx-auto">
                <div>
                  <div className="flex justify-between text-sm font-['Space_Grotesk'] text-[#e3e2e7] mb-2 uppercase tracking-wide">
                    <span>Ape Energy</span>
                    <span className="text-[#6cff32]">{isDemoMode ? '94%' : `${stats?.panicSellScore || 0}%`}</span>
                  </div>
                  <div className="h-2 w-full bg-[#121317] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#6cff32] to-[#50e304]" style={{width: isDemoMode ? '94%' : `${Math.min(stats?.panicSellScore || 0, 100)}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-['Space_Grotesk'] text-[#e3e2e7] mb-2 uppercase tracking-wide">
                    <span>Tokens to Zero</span>
                    <span className="text-[#ffb4ab]">{isDemoMode ? '12' : stats?.tokensHeldToZero || 0}</span>
                  </div>
                  <div className="h-2 w-full bg-[#121317] rounded-full overflow-hidden">
                    <div className="h-full bg-[#ffb4ab]" style={{width: isDemoMode ? '12%' : `${Math.min((stats?.tokensHeldToZero || 0) * 10, 100)}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-['Space_Grotesk'] text-[#e3e2e7] mb-2 uppercase tracking-wide">
                    <span>Gas Guzzler</span>
                    <span className="text-[#00eefc]">{isDemoMode ? '88%' : `${stats?.sellWithin6h || 0}% sell within 6h`}</span>
                  </div>
                  <div className="h-2 w-full bg-[#121317] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00eefc]" style={{width: isDemoMode ? '88%' : `${Math.min(stats?.sellWithin6h || 0, 100)}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )
        ) : (
          <div className="text-center py-24 w-full border border-[#3d4b36]/30 bg-[#1e1f23] rounded-xl max-w-3xl">
            <span className="material-symbols-outlined text-6xl text-[#343439] mb-4">monitoring</span>
            <p className="text-xl text-gray-400 font-['Space_Grotesk'] mb-8">No on-chain data generated yet.</p>
            <Link href="/" className="inline-block bg-[#343439]/40 backdrop-blur-md border border-[#3d4b36]/30 text-white font-['Space_Grotesk'] font-bold uppercase tracking-widest text-sm px-6 py-4 rounded-md transition-all active:scale-95 hover:bg-[#343439]">Analyze Wallet First</Link>
          </div>
        )}
      </main>
      <div className="fixed bottom-0 right-0 w-[30vw] h-[30vw] bg-[#ffb4ab]/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
}
