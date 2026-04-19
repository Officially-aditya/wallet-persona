export async function fetchFourMemeTrades(walletAddress: string) {
  const API_KEY = process.env.NEXT_PUBLIC_BSCSCAN_API_KEY;
  if (!API_KEY) {
    throw new Error('Missing BSCSCAN_API_KEY');
  }

  const FOUR_MEME_CONTRACT = '0x5c952063c7fc8610FFDB798152D69F0B9550762b'.toLowerCase();

  const res = await fetch(
    `https://api.bscscan.com/api?module=account&action=tokentx&address=${walletAddress}&sort=asc&apikey=${API_KEY}`
  );
  const data = await res.json();

  if (data.status !== '1' && data.message === 'No transactions found') {
    return { stats: null, trades: [], noHistory: true, error: 'No transactions found' };
  }
  if (!data.result || !Array.isArray(data.result)) {
    return { stats: null, trades: [], noHistory: true, error: 'Invalid API response' };
  }

  // Filter 4meme trades
  const memetrades = data.result.filter((tx: any) =>
    (tx.to && tx.to.toLowerCase() === FOUR_MEME_CONTRACT) ||
    (tx.from && tx.from.toLowerCase() === FOUR_MEME_CONTRACT)
  );

  if (memetrades.length === 0) {
    return { stats: null, trades: [], noHistory: true };
  }

  // Basic trade analysis
  const tokens = new Map<string, any>();
  const parsedTrades = memetrades.map((tx: any) => {
    const isBuy = tx.from && tx.from.toLowerCase() === FOUR_MEME_CONTRACT;
    const direction = isBuy ? 'BUY' : 'SELL';
    const value = parseInt(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal));
    const time = parseInt(tx.timeStamp) * 1000;

    let tkInfo = tokens.get(tx.tokenSymbol) || { buys: 0, sells: 0, firstBuy: null, firstSell: null };
    if (direction === 'BUY') {
      tkInfo.buys += value;
      if (!tkInfo.firstBuy) tkInfo.firstBuy = time;
    } else {
      tkInfo.sells += value;
      if (!tkInfo.firstSell) tkInfo.firstSell = time;
    }
    tokens.set(tx.tokenSymbol, tkInfo);

    return {
      tokenName: tx.tokenName,
      tokenSymbol: tx.tokenSymbol,
      value,
      direction,
      timeStamp: new Date(time).toISOString(),
      hash: tx.hash,
    };
  });

  let totalTrades = tokens.size;
  let tokensHeldToZero = 0;
  let totalHoldTime = 0;
  let holdCount = 0;
  let sellWithin6hCount = 0;

  for (const [symbol, tk] of Array.from(tokens.entries())) {
    if (tk.buys > 0 && tk.sells === 0) {
      tokensHeldToZero++;
    }
    if (tk.firstBuy && tk.firstSell) {
      const diffHrs = (tk.firstSell - tk.firstBuy) / (1000 * 60 * 60);
      totalHoldTime += diffHrs;
      holdCount++;
      if (diffHrs <= 6) {
        sellWithin6hCount++;
      }
    }
  }

  const avgHoldDuration = holdCount ? (totalHoldTime / holdCount).toFixed(2) : '0';
  const sellWithin6h = totalTrades ? ((sellWithin6hCount / holdCount) * 100).toFixed(0) : '0';

  const stats = {
    totalTrades: totalTrades,
    avgHoldDuration: Number(avgHoldDuration),
    sellWithin6h: Number(sellWithin6h),
    tokensHeldToZero: tokensHeldToZero,
    bestTrade: 'Unavailable (Price tracking needed)',
    worstTrade: 'Unavailable (Price tracking needed)'
  };

  return { trades: parsedTrades, stats, noHistory: false };
}