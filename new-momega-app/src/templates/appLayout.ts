import { AppConfig } from '../types';

export function generateAppLayout(config: AppConfig): string {
  let imports = `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';`;

  if (config.features.clerk) {
    imports += `\nimport { ClerkProvider } from '@clerk/nextjs';`;
  }

  if (config.features.pwa) {
    imports += `\nimport { Analytics } from '@vercel/analytics/react';`;
  }

  const fontConfig = `const inter = Inter({ subsets: ['latin'] });`;

  const metadata = `export const metadata: Metadata = {
  title: {
    default: '${config.projectName}',
    template: '%s | ${config.projectName}',
  },
  description: 'A modern, opinionated Next.js application built with the MonteLogic template.',
  openGraph: {
    title: '${config.projectName}',
    description: 'A modern, opinionated Next.js application built with the MonteLogic template.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};`;

  let layoutContent = `export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>`;

  if (config.features.clerk) {
    layoutContent += `
        <ClerkProvider>`;
  }

  layoutContent += `
        {children}`;

  if (config.features.pwa) {
    layoutContent += `
        <Analytics />`;
  }

  if (config.features.clerk) {
    layoutContent += `
        </ClerkProvider>`;
  }

  layoutContent += `
      </body>
    </html>
  );
}`;

  return `${imports}

${fontConfig}

${metadata}

${layoutContent}`;
}
