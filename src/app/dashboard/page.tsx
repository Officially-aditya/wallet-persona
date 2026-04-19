'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function DashboardPage() {
  const [persona, setPersona] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('persona');
    if (saved) {
      try { setPersona(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const downloadCard = async () => {
    try {
      const el = document.getElementById('persona-card');
      if (!el) {
        console.error('Card element not found');
        return;
      }
      
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(el, { 
        pixelRatio: 2, 
        backgroundColor: '#0f172a',
        style: { transform: 'none' }
      });
      
      const link = document.createElement('a');
      link.download = 'wallet-persona.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error generating image:', err);
    }
  };

  const shareOnX = () => {
    if (!persona) return;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I am "${persona.archetype}" on Four.meme! %0A%0AFind out your Wallet Persona at: https://four.meme`)}`, '_blank');
  };

  return (
    <div className="bg-[#121317] text-[#e3e2e7] font-[family-name:var(--font-body)] flex flex-col min-h-screen overflow-x-hidden">
      {/* TopAppBar */}
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
          <div className="flex items-center space-x-6">
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="font-['Space_Grotesk'] text-5xl font-black uppercase tracking-tighter mb-8 text-center text-[#e3e2e7]">Your Dashboard</h1>
        {mounted && persona ? (
          <div className="flex flex-col gap-6 w-full max-w-md">
            <div id="persona-card" className="bg-glitch-chart rounded-xl p-1 relative overflow-hidden group aspect-[3/4] w-full mx-auto shadow-[0_0_40px_rgba(108,255,50,0.15)] mt-4">
              <div className="absolute inset-0 transition-all duration-300 bg-[#1e1f23]/50 backdrop-blur-[2px] group-hover:backdrop-blur-[1px]"></div>
              <div className="relative h-full w-full bg-[#1e1f23]/80 backdrop-blur-md rounded-lg border border-[#3d4b36]/30 flex flex-col p-8 justify-between">
                <div className="flex justify-between items-start">
                  <div className="font-['Space_Grotesk'] text-[#6cff32] text-sm font-bold tracking-widest uppercase">
                    Season 1
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-[#6cff32]/30 overflow-hidden flex items-center justify-center bg-[#121317]">
                    <span className="material-symbols-outlined text-[#6cff32] text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>account_circle</span>
                  </div>
                </div>
                <div className="text-center my-8">
                  <h2 className="font-['Space_Grotesk'] text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2" dangerouslySetInnerHTML={{ __html: persona.archetype.replace(/ /g, '<br/>') }}>
                  </h2>
                </div>
                <div className="bg-[#121317]/60 backdrop-blur-sm rounded-lg p-4 flex justify-between items-end border border-white/5">
                  <div>
                    <div className="font-['Space_Grotesk'] text-xs text-gray-400 uppercase tracking-widest mb-1">Status</div>
                    <div className="font-['Space_Grotesk'] text-xl font-bold text-[#6cff32]">ACTIVE</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button onClick={downloadCard} className="flex-1 bg-[#1e1f23]/50 hover:bg-[#1e1f23] backdrop-blur-md border border-[#3d4b36]/30 text-white font-['Space_Grotesk'] font-bold uppercase tracking-widest text-sm px-6 py-4 rounded-md transition-all active:scale-95 duration-200 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">download</span>
                Download
              </button>
              <button onClick={shareOnX} className="flex-1 bg-gradient-to-r from-[#6cff32] to-[#50e304] text-[#0e3900] font-['Space_Grotesk'] font-bold uppercase tracking-widest text-sm px-6 py-4 rounded-md active:scale-95 duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(108,255,50,0.3)] hover:shadow-[0_0_20px_rgba(108,255,50,0.4)]">
                <span className="material-symbols-outlined">share</span>
                Share to X
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-[#343439] mb-4">search_off</span>
            <p className="text-xl text-gray-400 font-['Space_Grotesk']">No persona found. Go analyze your wallet first!</p>
            <Link href="/" className="mt-8 inline-block px-8 py-3 rounded-md bg-[#6cff32]/10 text-[#6cff32] font-bold hover:bg-[#6cff32]/20 transition-all font-['Space_Grotesk'] uppercase tracking-widest">Back to Home</Link>
          </div>
        )}
      </main>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-[#6cff32]/5 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );
}
