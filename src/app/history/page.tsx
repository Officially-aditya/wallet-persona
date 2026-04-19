'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const MOCK_COINS = [
  { name: 'Four Meme Coin', symbol: 'FOUR', amount: '+ 420,000', type: 'buy', time: '2 mins ago', icon: '🔥' },
  { name: 'Pepe', symbol: 'PEPE', amount: '- 1,337,000', type: 'sell', time: '1 hr ago', icon: '🐸' },
  { name: 'Shiba Inu', symbol: 'SHIB', amount: '+ 5,000,000', type: 'buy', time: '4 hrs ago', icon: '🐕' },
  { name: 'Wojak', symbol: 'WOJAK', amount: '- 50,000', type: 'sell', time: '12 hrs ago', icon: '😭' },
  { name: 'Milady Maker', symbol: 'LADY', amount: '+ 10,000', type: 'buy', time: '1 day ago', icon: '👒' },
];

export default function HistoryPage() {
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [isGhost, setIsGhost] = useState(false);

  useEffect(() => {
    const savedPersona = localStorage.getItem('persona');
    if (savedPersona) {
      try {
        const p = JSON.parse(savedPersona);
        if (p.archetype === 'GHOST WALLET') setIsGhost(true);
      } catch (e) {}
    }
    setMounted(true);
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

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 w-full max-w-4xl mx-auto flex flex-col items-center z-10 relative">
        <h1 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-[#e3e2e7] w-full text-left">Traded Coins</h1>
        <p className="text-[#bccbb0] w-full text-left max-w-2xl font-['Inter'] mb-8">
          A glorious record of your financial decisions. Most recent token swaps and trades involving <span className="text-[#6cff32]">Four.meme</span> tokens.
        </p>

        {mounted && address ? (
          isGhost ? (
            <div className="text-center py-24 w-full bg-[#1a1b1f] rounded-xl border border-[#ffb4ab]/30 flex flex-col items-center justify-center gap-4">
              <span className="text-6xl">👻</span>
              <p className="text-2xl text-gray-200 font-['Space_Grotesk'] font-bold">You haven't traded anything.</p>
              <p className="text-[#ffb4ab] font-['Space_Grotesk']">Spend a dime to get lime. This wallet is a ghost town!</p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              {MOCK_COINS.map((coin, idx) => (
                <div key={idx} className="bg-[#1a1b1f] border border-[#3d4b36]/30 rounded-xl p-5 flex items-center justify-between hover:border-[#6cff32]/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#121317] rounded-full flex items-center justify-center text-2xl border border-[#343439]">
                      {coin.icon}
                    </div>
                    <div>
                      <h3 className="font-['Space_Grotesk'] font-bold text-lg text-white">{coin.name}</h3>
                      <span className="text-xs text-gray-500 font-mono uppercase">{coin.symbol} • {coin.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-['Space_Grotesk'] font-bold text-lg ${coin.type === 'buy' ? 'text-[#6cff32]' : 'text-[#ffb4ab]'}`}>
                      {coin.amount} {coin.symbol}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">{coin.type === 'buy' ? 'SWAP IN' : 'DUMPED'}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-24 w-full bg-[#1a1b1f] rounded-xl border border-[#3d4b36]/30">
            <span className="material-symbols-outlined text-6xl text-[#343439] mb-4">account_balance_wallet</span>
            <p className="text-xl text-gray-400 font-['Space_Grotesk']">Connect your wallet to view history.</p>
          </div>
        )}
      </main>
      <div className="fixed top-1/4 left-1/4 w-[40vw] h-[40vw] bg-[#6cff32]/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
    </div>
  );
}
