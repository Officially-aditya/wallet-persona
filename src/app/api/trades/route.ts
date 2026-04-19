import { NextResponse } from 'next/server';

const FOUR_MEME_CONTRACT = '0x5c952063c7fc8610ffdb798152d69f0b9550762b'.toLowerCase();
const BSCSCAN_API_KEY = process.env.NEXT_PUBLIC_BSCSCAN_API_KEY;

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: true, message: 'Wallet address required' }, { status: 400 });
    }

    if (!BSCSCAN_API_KEY) {
      return NextResponse.json({ error: true, message: 'BscScan API key not configured' }, { status: 500 });
    }

    try {
      // Fetch all token transfers for this wallet
      const res = await fetch(
        `https://api.bscscan.com/api?module=account&action=tokentx&address=${walletAddress}&sort=asc&apikey=${BSCSCAN_API_KEY}`
      );
      const data = await res.json();

      if (data.status !== '1' || !data.result || !Array.isArray(data.result)) {
        return NextResponse.json({ stats: null, trades: [], noHistory: true });
      }

      // Filter for Four.meme trades only
      const events = data.result
        .filter((tx: any) => 
          (tx.to && tx.to.toLowerCase() === FOUR_MEME_CONTRACT) ||
          (tx.from && tx.from.toLowerCase() === FOUR_MEME_CONTRACT)
        )
        .map((tx: any) => ({
          tokenName: tx.tokenName,
          tokenSymbol: tx.tokenSymbol,
          tokenAddress: tx.contractAddress,
          amount: parseInt(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal)),
          type: tx.from && tx.from.toLowerCase() === FOUR_MEME_CONTRACT ? 'buy' : 'sell',
          timestamp: parseInt(tx.timeStamp) * 1000,
          hash: tx.hash
        }));

      if (events.length === 0) {
        return NextResponse.json({ stats: null, trades: [], noHistory: true });
      }

      // Compute statistics
      let totalBuys = 0;
      let totalSells = 0;
      let totalHoldTimeHrs = 0;
      let holdCount = 0;
      let sellWithin6hCount = 0;
      let tokensHeldToZero = 0;
      let panicSellCount = 0;

      const tokenState = new Map<string, any>();

      events.forEach((ev: any) => {
        const isBuy = ev.type?.toLowerCase() === 'buy';
        if (isBuy) totalBuys++;
        else totalSells++;

        const tState = tokenState.get(ev.tokenSymbol) || { buys: 0, sells: 0, firstBuy: null, firstSell: null };
        if (isBuy) {
          tState.buys += ev.amount;
          if (!tState.firstBuy) tState.firstBuy = ev.timestamp;
        } else {
          tState.sells += ev.amount;
          if (!tState.firstSell) tState.firstSell = ev.timestamp;
        }
        tokenState.set(ev.tokenSymbol, tState);
      });

      tokenState.forEach((state) => {
        if (state.firstBuy && state.firstSell) {
          const diffHrs = Math.max(0, (state.firstSell - state.firstBuy) / (1000 * 60 * 60));
          totalHoldTimeHrs += diffHrs;
          holdCount++;
          
          if (diffHrs <= 6) {
            sellWithin6hCount++;
          }
          if (diffHrs <= 2) {
            panicSellCount++;
          }
        } else if (state.buys > 0 && state.sells === 0) {
          tokensHeldToZero++;
        }
      });

      const avgHoldDuration = holdCount > 0 ? (totalHoldTimeHrs / holdCount).toFixed(2) : '0';
      const sellWithin6h = holdCount > 0 ? ((sellWithin6hCount / holdCount) * 100).toFixed(0) : '0';
      const panicSellScore = holdCount > 0 ? ((panicSellCount / holdCount) * 100).toFixed(0) : '0';

      const stats = {
        totalTrades: tokenState.size,
        totalBuys,
        totalSells,
        avgHoldDuration: Number(avgHoldDuration),
        sellWithin6h: Number(sellWithin6h),
        tokensHeldToZero,
        graduatedTokens: 0,
        bestTrade: 'Token A (Est: +250%)',
        worstTrade: 'Token B (Est: -99%)',
        panicSellScore: Number(panicSellScore)
      };

      return NextResponse.json({ stats, trades: events });
    } catch (apiError: any) {
      return NextResponse.json({ error: true, message: apiError.message || 'Failed to fetch trade data' });
    }
  } catch (err: any) {
    return NextResponse.json({ error: true, message: err.message }, { status: 500 });
  }
}