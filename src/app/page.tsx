'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { PersonaCard } from '@/components/PersonaCard';

interface PersonaData {
  archetype: string;
  roast: string;
  flags: string[];
  degenScore: string;
  missedGains: string;
  verdict: string;
}

interface TradeStats {
  totalTrades: number;
  totalBuys: number;
  totalSells: number;
  avgHoldDuration: number;
  sellWithin6h: number;
  tokensHeldToZero: number;
  panicSellScore: number;
}

type AppState = 'IDLE' | 'CONNECTED' | 'LOADING' | 'RESULT' | 'ERROR' | 'NO_HISTORY';
const LOADING_MESSAGES = ["Scanning...", "Counting mistakes...", "Calculating losses...", "Consulting oracle...", "Generating archetype..."];

export default function Home() {
  const { address, isConnected } = useAccount();
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [persona, setPersona] = useState<PersonaData | null>(null);
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  React.useEffect(() => {
    if (isConnected && appState === 'IDLE' && !isDemoMode) setAppState('CONNECTED');
    else if (!isConnected && appState !== 'IDLE' && !isDemoMode) setAppState('IDLE');
    
    // Automatically purge demo mode if user actually connects a real wallet
    if (isConnected && isDemoMode) {
      setIsDemoMode(false);
      localStorage.removeItem('isDemoMode');
      setAppState('CONNECTED');
    }
  }, [isConnected, address, appState, isDemoMode]);

  React.useEffect(() => {
    // Load isDemoMode from localStorage on mount
    const savedDemo = localStorage.getItem('isDemoMode');
    if (savedDemo === 'true') {
      setIsDemoMode(true);
    }
  }, []);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState === 'LOADING') {
      interval = setInterval(() => {
        setLoadingMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
        setLoadingProgress(p => (p >= 90 ? p : p + Math.random() * 20));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [appState]);

  const enableDemoMode = () => {
    setIsDemoMode(true);
    localStorage.setItem('isDemoMode', 'true');
    analyzeWallet(true);
  };

  const analyzeWallet = async (forceDemo: boolean | React.MouseEvent = false) => {
    if (isDemoMode || forceDemo === true) {
      setAppState('LOADING');
      setLoadingMsgIdx(0);
      setLoadingProgress(0);
      setTimeout(() => {
        const p = { archetype: 'The Diamond-Handed Degen', roast: 'You don\'t know what a stop-loss is, and you refuse to learn. Your portfolio is a volatile mix of highly speculative assets, yet your sheer stubbornness occasionally results in legendary gains. You thrive in chaotic market conditions.', flags: [], degenScore: 'MAX', missedGains: '420', verdict: 'Diamond Hands' };
        setPersona(p);
        localStorage.setItem('persona', JSON.stringify(p));
        const s = {
          totalTrades: 1337,
          totalBuys: 420,
          totalSells: 917,
          avgHoldDuration: 1420,
          sellWithin6h: 88,
          tokensHeldToZero: 12,
          panicSellScore: 94
        };
      setStats(s);
      localStorage.setItem('stats', JSON.stringify(s));
      setLoadingProgress(100);
      window.location.href = '/dashboard';
    }, 3000);
    return;
    }
    if (!address) return;
    try {
      setAppState('LOADING');
      setLoadingMsgIdx(0);
      setLoadingProgress(0);
      const res = await fetch('/api/trades', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ walletAddress: address }) });
      const data = await res.json();
      
      if (data.noHistory) { 
        const ghostPersona = {
          archetype: 'GHOST WALLET',
          roast: 'You gotta spend a dime to get lime. This wallet is cleaner than a rug pull\'s promises. Literal crickets.',
          flags: ['NO ACTIVITY', 'NGMI', 'INVISIBLE'],
          degenScore: '0',
          missedGains: '$0.00',
          verdict: 'Touch grass (and then touch a block explorer)'
        };
        const ghostStats = {
          totalTrades: 0,
          totalBuys: 0,
          totalSells: 0,
          avgHoldDuration: 0,
          sellWithin6h: 0,
          tokensHeldToZero: 0,
          panicSellScore: 0
        };
        setPersona(ghostPersona);
        setStats(ghostStats);
        localStorage.setItem('persona', JSON.stringify(ghostPersona));
        localStorage.setItem('stats', JSON.stringify(ghostStats));
        
        setLoadingProgress(100);
        window.location.href = '/dashboard';
        return; 
      }
      
      if (data.error) { setErrorMsg(data.message || 'Error'); setAppState('ERROR'); return; }
      setStats(data.stats);
      localStorage.setItem('stats', JSON.stringify(data.stats));
      let res2 = await fetch('/api/persona', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      let data2 = await res2.json();
      if (data2.error || !data2.archetype) {
        res2 = await fetch('/api/persona', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, retry: true }) });
        data2 = await res2.json();
      }
      const p = data2 || { archetype: 'ERROR', roast: 'Failed', flags: [], degenScore: '0', missedGains: '0', verdict: 'Unknown' };
      setPersona(p);
      localStorage.setItem('persona', JSON.stringify(p));
      setLoadingProgress(100);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setErrorMsg(err.message || 'Error');
      setAppState('ERROR');
    }
  };

  if (appState === 'LOADING') {
    return (
      <div className="min-h-screen bg-[#121317] flex items-center justify-center gap-12 px-6">
        <div className="relative w-80 h-80 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border border-[#6cff32]/20"></div>
          <div className="absolute inset-[20%] rounded-full border border-[#6cff32]/30"></div>
          <div className="absolute inset-[40%] bg-[#1e1f23] rounded-full flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-5xl text-[#6cff32]">radar</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 max-w-sm">
          <h1 className="text-4xl font-black text-white">Analyzing...</h1>
          <div className="text-[#bccbb0]">{Math.round(loadingProgress)}%</div>
          <div className="w-full h-2 bg-[#343439] rounded overflow-hidden">
            <div className="h-full bg-[#6cff32]" style={{ width: `${loadingProgress}%` }}></div>
          </div>
          <div className="bg-[#1e1f23] rounded p-3 font-mono text-sm text-[#6cff32]">{LOADING_MESSAGES[loadingMsgIdx]}</div>
        </div>
      </div>
    );
  }

  // Result State is now natively offloaded to /dashboard.
  if (appState === 'RESULT' && persona) {
    return null;
  }

  if (appState === 'ERROR') {
    return (
      <main className="min-h-screen bg-[#121317] flex items-center justify-center">
        <div className="text-center"><h1 className="text-4xl font-bold text-[#ffb4ab]">Error</h1><p className="text-[#bccbb0] my-4">{errorMsg}</p><button onClick={analyzeWallet} className="bg-[#343439] text-white px-4 py-2 rounded">Try Again</button></div>
      </main>
    );
  }

  if (appState === 'NO_HISTORY') {
    return (
      <div className="min-h-screen bg-[#121317] text-[#e3e2e7] font-body flex flex-col">
        {/* TopNavBar */}
        <nav className="sticky top-0 w-full z-50 bg-zinc-950/60 backdrop-blur-lg border-b-0 shadow-[0_8px_32px_rgba(108,255,50,0.05)]">
          <div className="flex justify-between items-center px-8 py-4 w-full">
            <div className="flex items-center gap-8">
              <button onClick={(e) => { e.preventDefault(); setAppState('IDLE'); setIsDemoMode(false); localStorage.removeItem('isDemoMode'); }} className="text-2xl font-black italic tracking-tighter text-lime-400 font-['Space_Grotesk'] text-left">Wallet Persona</button>
              <div className="hidden md:flex gap-6 font-['Space_Grotesk'] tracking-tight">
                <Link href="/dashboard" className="text-zinc-400 hover:text-lime-300 hover:bg-zinc-900/40 px-3 py-2 rounded active:scale-95 transition-all cursor-pointer">Dashboard</Link>
                <Link href="/history" className="text-zinc-400 hover:text-lime-300 hover:bg-zinc-900/40 px-3 py-2 rounded active:scale-95 transition-all cursor-pointer">History</Link>
                <Link href="/analytics" className="text-zinc-400 hover:text-lime-300 hover:bg-zinc-900/40 px-3 py-2 rounded active:scale-95 transition-all cursor-pointer">Analytics</Link>
              </div>
            </div>
            <ConnectButton />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden">
          {/* Ambient Background Shards */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00eefc]/20 rounded-full blur-[100px] -z-10 mix-blend-screen"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#ffd4f5]/10 rounded-full blur-[120px] -z-10 mix-blend-screen"></div>

          <div className="max-w-3xl w-full flex flex-col items-center text-center gap-12 relative z-10">
            {/* Visual Element: Radar / Ghost Icon */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#6cff32]/20"></div>
              <div className="absolute inset-4 rounded-full border border-[#6cff32]/40 border-dashed"></div>
              <div className="absolute inset-8 rounded-full border border-[#6cff32]/60"></div>
              <div className="w-24 h-24 bg-[#343439]/60 backdrop-blur-xl rounded-full flex items-center justify-center shadow-[0_0_32px_rgba(108,255,50,0.15)]">
                <span className="material-symbols-outlined text-6xl text-[#6cff32]" style={{fontVariationSettings: "'FILL' 0"}}>radar</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#121317] via-transparent to-transparent z-20"></div>
            </div>

            {/* Typography Header */}
            <div className="flex flex-col gap-4">
              <h1 className="font-['Space_Grotesk'] font-black text-5xl md:text-7xl tracking-tighter uppercase drop-shadow-[0_4px_24px_rgba(108,255,50,0.2)]">GHOST WALLET DETECTED</h1>
              <p className="font-body text-lg md:text-xl text-[#bccbb0] max-w-2xl mx-auto leading-relaxed">Our scanners found zero trading history on Four.meme for this address. We can't build a persona out of thin air.</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center mt-4">
              <a href="https://four.meme" target="_blank" rel="noopener noreferrer" className="flex-1 bg-gradient-to-br from-[#6cff32] to-[#50e304] text-[#0e3900] font-['Space_Grotesk'] font-bold text-base px-8 py-4 rounded-lg active:scale-95 transition-all shadow-[0_0_24px_rgba(108,255,50,0.2)] hover:shadow-[0_0_32px_rgba(108,255,50,0.4)] text-center uppercase tracking-wide">TRADE ON FOUR.MEME</a>
              <button onClick={() => setAppState('IDLE')} className="flex-1 bg-[#343439]/50 backdrop-blur-md text-[#e3e2e7] font-['Space_Grotesk'] font-bold text-base px-8 py-4 rounded-lg active:scale-95 transition-all hover:bg-[#343439] uppercase tracking-wide border border-[#3d4b36]/30">TRY ANOTHER WALLET</button>
            </div>

            {/* Data Shard Snippet (Decorative) */}
            <div className="mt-8 bg-[#1e1f23] p-6 rounded-lg w-full max-w-lg border border-transparent flex flex-col gap-3 text-left opacity-60">
              <div className="flex justify-between items-center">
                <span className="font-['Space_Grotesk'] text-xs text-[#bccbb0] uppercase tracking-widest">Scan Status</span>
                <span className="font-['Space_Grotesk'] text-xs text-[#ffb4ab] font-bold uppercase">Negative</span>
              </div>
              <div className="h-px w-full bg-[#343439]/30"></div>
              <div className="flex justify-between items-center font-body text-sm text-[#e3e2e7]">
                <span className="truncate pr-4 text-zinc-500">{address?.substring(0, 10)}...{address?.substring(address.length - 6)}</span>
                <span className="font-mono text-zinc-500">0 TXNS</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-12 bg-zinc-900 border-t-0">
          <div className="flex flex-col md:flex-row justify-between items-center px-12 gap-8 w-full">
            <div className="text-lg font-bold text-zinc-100 font-['Space_Grotesk'] uppercase tracking-widest">WALLET PERSONA</div>
            <div className="flex flex-wrap justify-center gap-6 font-['Space_Grotesk'] uppercase text-[10px] tracking-widest text-zinc-500">
              <a className="hover:text-lime-400 transition-colors opacity-80 hover:opacity-100" href="#">Documentation</a>
              <a className="hover:text-lime-400 transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
              <a className="hover:text-lime-400 transition-colors opacity-80 hover:opacity-100" href="#">API Status</a>
            </div>
            <div className="font-['Space_Grotesk'] uppercase text-[10px] tracking-widest text-zinc-500 opacity-80">© 2026 WALLET PERSONA</div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-[#121317] text-[#e3e2e7] min-h-screen flex flex-col">
      {/* Ambient Background Shards */}
      <div className="fixed bg-[#ffd4f5] top-[-100px] left-[-100px] w-[400px] h-[400px] blur-[80px] opacity-15 rounded-full -z-10 pointer-events-none"></div>
      <div className="fixed bg-[#00eefc] bottom-1/4 right-[-50px] w-[500px] h-[500px] blur-[80px] opacity-10 rounded-full -z-10 pointer-events-none"></div>

      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#121317]/60 backdrop-blur-xl bg-gradient-to-b from-[#121317] to-transparent shadow-[0_8px_32px_rgba(108,255,50,0.06)] flex justify-between items-center px-12 h-20">
        <div className="flex items-center gap-8">
          <button onClick={(e) => { e.preventDefault(); setAppState('IDLE'); setIsDemoMode(false); localStorage.removeItem('isDemoMode'); }} className="text-2xl font-black italic tracking-tighter text-[#6CFF32] font-['Space_Grotesk'] uppercase text-left">WALLET PERSONA</button>
          <div className="hidden md:flex items-center gap-6 font-['Space_Grotesk'] tracking-tighter uppercase font-bold text-sm">
            <Link href="/dashboard" className="text-gray-400 hover:text-[#6CFF32] hover:bg-[#6CFF32]/10 px-3 py-2 rounded-md active:scale-95 transition-all cursor-pointer">Dashboard</Link>
            <Link href="/history" className="text-gray-400 hover:text-[#6CFF32] hover:bg-[#6CFF32]/10 px-3 py-2 rounded-md active:scale-95 transition-all cursor-pointer">History</Link>
            <Link href="/analytics" className="text-gray-400 hover:text-[#6CFF32] hover:bg-[#6CFF32]/10 px-3 py-2 rounded-md active:scale-95 transition-all cursor-pointer">Analytics</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-[#6CFF32] transition-colors p-2 rounded-full hover:bg-[#6CFF32]/10 active:scale-95 duration-200 hidden md:flex">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>settings</span>
          </button>
          <button className="text-gray-400 hover:text-[#6CFF32] transition-colors p-2 rounded-full hover:bg-[#6CFF32]/10 active:scale-95 duration-200 hidden md:flex mr-4">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>notifications</span>
          </button>
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
              const ready = mounted;
              const connected = ready && account && chain;
              return (
                <div {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
                  {(() => {
                    if (!connected) {
                      return (
                        <button onClick={openConnectModal} type="button" className="bg-gradient-to-r from-[#6cff32] to-[#50e304] text-[#0e3900] font-['Space_Grotesk'] font-bold tracking-widest px-6 py-2 rounded-md hover:shadow-[0_0_15px_rgba(108,255,50,0.4)] transition-all flex items-center gap-2 active:scale-95">
                          Connect
                        </button>
                      );
                    }
                    if (chain.unsupported) {
                      return (
                        <button onClick={openChainModal} type="button" className="bg-[#ffb4ab] text-[#340000] font-['Space_Grotesk'] font-bold tracking-widest px-4 py-2 rounded-md shadow-md transition-all flex items-center gap-2 active:scale-95">
                          Wrong Network
                        </button>
                      );
                    }
                    return (
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={openAccountModal} type="button" className="bg-[#343439]/40 backdrop-blur-md text-[#6cff32] font-['Space_Grotesk'] font-bold tracking-wide px-4 py-2 rounded-md hover:bg-[#343439] transition-all border border-[#6cff32]/20 active:scale-95">
                          {account.displayName}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </nav>

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col gap-24 relative z-10">
        {appState === 'IDLE' && (
          <>
            {/* Hero Section */}
            <section className="flex flex-col items-start gap-8 w-full max-w-4xl">
              <h1 className="font-['Space_Grotesk'] font-black text-6xl md:text-8xl leading-none tracking-tighter uppercase text-[#e3e2e7]">WHAT DOES YOUR <br/><span className="bg-gradient-to-r from-[#6cff32] to-[#50e304] bg-clip-text text-transparent">WALLET SAY</span><br/>ABOUT YOU?</h1>
              <p className="font-['Inter'] text-xl text-[#bccbb0] max-w-2xl leading-relaxed">We analyze your on-chain history to generate a brutally honest, highly shareable profile of your trading behavior. No sugar-coating. Just data.</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <ConnectButton.Custom>
                  {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;
                    
                    return (
                      <div {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
                        {(() => {
                          if (!connected) {
                            return (
                              <button onClick={openConnectModal} type="button" className="bg-gradient-to-r from-[#6cff32] to-[#50e304] text-[#0e3900] font-['Space_Grotesk'] font-bold uppercase tracking-widest px-8 py-4 rounded-md hover:shadow-[0_0_20px_rgba(108,255,50,0.4)] transition-all text-lg flex items-center gap-2 active:scale-95 shadow-[0_0_15px_rgba(108,255,50,0.3)]">
                                Connect Wallet
                              </button>
                            );
                          }
                          if (chain.unsupported) {
                            return (
                              <button onClick={openChainModal} type="button" className="bg-[#ffb4ab] text-[#340000] font-['Space_Grotesk'] font-bold uppercase tracking-widest px-8 py-4 rounded-md shadow-md transition-all text-lg flex items-center gap-2">
                                Wrong Network
                              </button>
                            );
                          }
                          return (
                            <div style={{ display: 'flex', gap: 12 }}>
                              <button onClick={openAccountModal} type="button" className="bg-[#343439]/40 backdrop-blur-md text-[#6cff32] font-['Space_Grotesk'] font-bold uppercase tracking-wide px-6 py-4 rounded-md hover:bg-[#343439] transition-all border border-[#6cff32]/20 shadow-[0_0_10px_rgba(108,255,50,0.1)] text-lg">
                                {account.displayName}
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
                <button onClick={enableDemoMode} className="bg-[#343439]/40 backdrop-blur-md text-[#e3e2e7] font-['Space_Grotesk'] font-bold uppercase tracking-widest px-8 py-4 rounded-md hover:bg-[#343439] transition-all text-lg flex items-center gap-2 border border-white/5">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>science</span>Demo Mode
                </button>
              </div>
            </section>

            {/* Bento Grid Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {/* Feature 1: Deep Chain Analysis */}
              <div className="bg-[#1a1b1f] rounded-xl p-8 flex flex-col gap-6 col-span-1 md:col-span-2 relative overflow-hidden group border border-[#3d4b36]/15">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#6cff32] opacity-5 blur-[100px] group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="w-14 h-14 rounded-full bg-[#1e1f23] flex items-center justify-center border border-[#3d4b36]/30 text-[#6cff32] mb-2">
                  <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 0"}}>data_exploration</span>
                </div>
                <h3 className="font-['Space_Grotesk'] font-bold text-3xl uppercase tracking-tight text-[#e3e2e7]">Deep Chain Analysis</h3>
                <p className="font-['Inter'] text-[#bccbb0] text-lg">Our engine ingests thousands of transactions across multiple chains, identifying patterns, risk tolerance, and protocol loyalty. We don't just look at balances; we look at behavior.</p>
                <div className="mt-auto pt-8 flex gap-4">
                  <div className="flex-1 bg-[#1e1f23] rounded-lg p-4 border border-[#3d4b36]/15">
                    <span className="block text-xs font-['Space_Grotesk'] uppercase tracking-widest text-[#bccbb0] mb-1">Protocols Analyzed</span>
                    <span className="block text-2xl font-['Space_Grotesk'] font-bold text-[#e3e2e7]">500+</span>
                  </div>
                  <div className="flex-1 bg-[#1e1f23] rounded-lg p-4 border border-[#3d4b36]/15">
                    <span className="block text-xs font-['Space_Grotesk'] uppercase tracking-widest text-[#bccbb0] mb-1">Data Points</span>
                    <span className="block text-2xl font-['Space_Grotesk'] font-bold text-[#6cff32]">1.2M</span>
                  </div>
                </div>
              </div>

              {/* Feature 2: Brutally Honest Profiles */}
              <div className="bg-[#1a1b1f] rounded-xl p-8 flex flex-col gap-6 col-span-1 relative overflow-hidden group border border-[#3d4b36]/15">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffb4ab] opacity-5 blur-[60px] group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="w-14 h-14 rounded-full bg-[#1e1f23] flex items-center justify-center border border-[#3d4b36]/30 text-[#ffb4ab] mb-2">
                  <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 0"}}>local_fire_department</span>
                </div>
                <h3 className="font-['Space_Grotesk'] font-bold text-2xl uppercase tracking-tight text-[#e3e2e7]">Brutally Honest Profiles</h3>
                <p className="font-['Inter'] text-[#bccbb0]">Are you a diamond-handed visionary or a paper-handed panic seller? Our algorithm categorizes your archetype with ruthless accuracy.</p>
                <div className="mt-auto pt-4">
                  <div className="inline-flex items-center gap-2 bg-[#ffb4ab]/10 text-[#ffb4ab] px-3 py-1.5 rounded-full text-sm font-['Space_Grotesk'] uppercase tracking-wider font-bold">
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>Rug Prone
                  </div>
                </div>
              </div>

              {/* Feature 3: Shareable Receipts */}
              <div className="bg-[#1a1b1f] rounded-xl p-8 flex flex-col gap-6 col-span-1 relative overflow-hidden group border border-[#3d4b36]/15">
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#00eefc] opacity-5 blur-[80px] group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="w-14 h-14 rounded-full bg-[#1e1f23] flex items-center justify-center border border-[#3d4b36]/30 text-[#00eefc] mb-2">
                  <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 0"}}>receipt_long</span>
                </div>
                <h3 className="font-['Space_Grotesk'] font-bold text-2xl uppercase tracking-tight text-[#e3e2e7]">Shareable Receipts</h3>
                <p className="font-['Inter'] text-[#bccbb0]">Generate aesthetic, data-rich receipts of your biggest wins (and worst losses) optimized for social flexing.</p>
                <div className="mt-auto pt-4 flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#343439] border-2 border-[#1a1b1f] flex items-center justify-center text-xs text-[#e3e2e7]">X</div>
                  <div className="w-8 h-8 rounded-full bg-[#343439] border-2 border-[#1a1b1f] flex items-center justify-center text-xs text-[#e3e2e7]">FC</div>
                  <div className="w-8 h-8 rounded-full bg-[#343439] border-2 border-[#1a1b1f] flex items-center justify-center text-xs text-[#e3e2e7]">TG</div>
                </div>
              </div>

              {/* Dashboard Preview Shard */}
              <div className="bg-[#343439]/40 backdrop-blur-md rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 col-span-1 md:col-span-2 relative overflow-hidden border border-[#3d4b36]/20">
                <div className="flex-1 flex flex-col gap-4 z-10">
                  <h3 className="font-['Space_Grotesk'] font-bold text-3xl uppercase tracking-tight text-[#6cff32]">Engine Active</h3>
                  <p className="font-['Inter'] text-[#bccbb0]">Join thousands of degenerates who have already faced their financial reality. The engine is running.</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-3 h-3 rounded-full bg-[#6cff32] animate-pulse"></div>
                    <span className="font-['Space_Grotesk'] text-sm uppercase tracking-widest text-[#e3e2e7] font-bold">Systems Nominal</span>
                  </div>
                </div>
                <div className="w-full md:w-1/2 h-48 bg-[#0d0e12] rounded-lg border border-[#3d4b36]/10 relative overflow-hidden flex items-center justify-center opacity-80 mix-blend-screen" style={{backgroundImage: 'linear-gradient(to right, rgba(30, 31, 35, 0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 31, 35, 0.8) 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                  <div className="absolute bottom-0 w-full h-24 flex items-end justify-between px-4 gap-2 opacity-50">
                    <div className="w-1/6 bg-[#ffb4ab]/40 h-12"></div>
                    <div className="w-1/6 bg-[#6cff32]/40 h-20"></div>
                    <div className="w-1/6 bg-[#6cff32]/40 h-16"></div>
                    <div className="w-1/6 bg-[#ffb4ab]/40 h-8"></div>
                    <div className="w-1/6 bg-[#6cff32]/40 h-24"></div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {appState === 'CONNECTED' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 max-w-2xl mx-auto w-full text-center">
            <h2 className="text-5xl font-['Space_Grotesk'] font-black tracking-tight text-[#e3e2e7]">Ready to get roasted?</h2>
            <p className="text-[#bccbb0] max-w-md font-['Inter'] text-lg">We will analyze your {isDemoMode ? "Demo " : "Four.meme "}trading history on BNB Smart Chain and our AI will generate your brutally honest trader archetype.</p>
            <button onClick={analyzeWallet} className="bg-gradient-to-r from-[#6cff32] to-[#50e304] font-['Space_Grotesk'] font-bold uppercase tracking-widest px-8 py-4 rounded-md hover:opacity-90 active:scale-95 transition-all text-lg shadow-[0_0_20px_rgba(108,255,50,0.4)] flex items-center gap-2 text-[#0e3900] mt-4">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span>Analyze My Wallet
            </button>
            {isDemoMode && (
              <button onClick={() => { setIsDemoMode(false); setAppState('IDLE'); localStorage.removeItem('isDemoMode'); }} className="text-[#bccbb0] underline mt-4 hover:text-white">
                Cancel Demo
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#121317] w-full py-12 mt-auto flex flex-col md:flex-row justify-between items-center px-12 border-t border-[#6CFF32]/10 z-10 relative">
        <div className="flex items-center mb-6 md:mb-0">
          <span className="text-sm font-bold text-gray-500 font-['Space_Grotesk'] uppercase tracking-widest">© 2026 WALLET PERSONA // ENGINE_v1.0</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 font-['Space_Grotesk'] text-xs font-medium uppercase tracking-widest">
          <a className="text-gray-600 hover:text-[#6CFF32] transition-colors cursor-pointer" href="#">BNB Chain</a>
          <a className="text-gray-600 hover:text-[#6CFF32] transition-colors cursor-pointer" href="#">API Docs</a>
          <a className="text-gray-600 hover:text-[#6CFF32] transition-colors cursor-pointer" href="#">Privacy</a>
          <a className="text-gray-600 hover:text-[#6CFF32] transition-colors cursor-pointer" href="#">Status</a>
        </div>
      </footer>
    </div>
  );
}