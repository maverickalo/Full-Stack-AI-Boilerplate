import type { Metadata } from 'next';

import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Full-Stack AI Boilerplate',
  description:
    'Production-ready fullstack boilerplate with Next.js, Node.js, PostgreSQL, and OpenAI integration',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
