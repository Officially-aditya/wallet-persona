import { NextResponse } from 'next/server';

const OXLO_API_KEY = process.env.OXLO_API_KEY;
const OXLO_BASE_URL = 'https://api.oxlo.ai/v1';
const MODEL = 'deepseek-v3.2'; // Free model

export async function POST(req: Request) {
  try {
    const { stats, trades } = await req.json();

    if (!OXLO_API_KEY) {
      return NextResponse.json({ error: 'Oxlo API key not configured' }, { status: 500 });
    }

    const degenContext = trades && trades.length < 3 ? `Note: This user is a very new trader, only ${trades.length} trades. ` : "";

    const prompt = `You are a brutally honest but funny crypto trading analyst specializing in Four.meme meme coin traders on BNB Chain. Analyze this trader's complete history and generate their permanent trader identity. ${degenContext}
     
     TRADE STATS:
     - Unique tokens traded: ${stats.totalTrades}
     - Buy events: ${stats.totalBuys} | Sell events: ${stats.totalSells}
     - Average hold time: ${stats.avgHoldDuration} hours
     - Sold within 6 hours: ${stats.sellWithin6h}%
     - Dead bags (bought, never sold, token dead): ${stats.tokensHeldToZero}
     - Tokens that graduated (actual wins): ${stats.graduatedTokens}
     - Best trade: ${stats.bestTrade}
     - Worst trade: ${stats.worstTrade}
     
     Rules:
     - Be specific — reference the actual numbers in the roast
     - Be funny but not cruel
     - The archetype must be unique to this wallet's behavior, not generic
     - If graduatedTokens > 2, acknowledge they have some skill buried under the chaos
     
     Respond ONLY with a valid JSON object. No markdown, no backticks, no explanation. Format:
     {
       "archetype": "The [Title] — memorable, 3-5 words, captures their core flaw or style",
       "roast": "One brutal, specific, funny sentence using their actual stats",
       "flags": [
         "Specific behavioral observation with stat (e.g. You sell within 4h 78% of the time)",
         "Second observation with stat",
         "Third observation with stat"
       ],
       "degenScore": <number 1-100>,
       "missedGains": "Estimated value left on table as a string e.g. $12,400",
       "verdict": "One word verdict: Coward | Degenerate | Unlucky | Disciplined | Chaotic"
     }`;

    const response = await fetch(`${OXLO_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OXLO_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Oxlo API error: ${error}` }, { status: response.status });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      return NextResponse.json({ error: 'No content in response' }, { status: 500 });
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const persona = JSON.parse(jsonMatch[0]);
        return NextResponse.json(persona);
      } catch (e) {
        return NextResponse.json({ error: 'Failed to parse JSON response' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'No valid JSON found in response' }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}