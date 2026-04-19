import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'WALLET PERSONA | Desktop Landing Page',
  description: 'Find out what kind of degen you really are.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <style>{`
          body { 
            font-family: 'Inter', sans-serif; 
            background-color: #121317; 
            color: #e3e2e7; 
            overflow-x: hidden; 
          }
          h1, h2, h3, h4, h5, h6, .font-headline { 
            font-family: 'Space Grotesk', sans-serif; 
          }
          .glass-panel { 
            background: rgba(52, 52, 57, 0.4); 
            backdrop-filter: blur(12px); 
            -webkit-backdrop-filter: blur(12px); 
            border: 1px solid rgba(61, 75, 54, 0.15); 
          }
          .neon-gradient-text { 
            background: linear-gradient(135deg, #6cff32, #50e304); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
          }
          .ambient-glow { 
            box-shadow: 0 0 32px rgba(108, 255, 50, 0.06); 
          }
          .btn-gradient { 
            background: linear-gradient(135deg, #6cff32, #50e304); 
          }
          .material-symbols-outlined {
            font-family: 'Material Symbols Outlined';
            font-weight: normal;
            font-style: normal;
            font-size: 24px;
            display: inline-block;
            line-height: 1;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
          }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col bg-[#121317] text-[#e3e2e7]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
