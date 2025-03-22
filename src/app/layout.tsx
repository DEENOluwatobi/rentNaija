import "./globals.css";
import { Providers } from './providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RentNaija',
  description: 'Online apartment leasing agency',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className="w-full flex flex-col">
        <Providers>
          {children}
        </Providers>
        </body>
      </html>
  );
}