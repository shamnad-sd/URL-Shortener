import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from '../components/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LinkVault - URL Shortener',
  description: 'Shorten URLs and track analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              // Global styles
              style: {
                background: "#fff",
                color: "#11161F",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              },
              // Success toast
              success: {
                style: {
                  background: "#008236",
                  color: "#fff",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#008236",
                },
              },
              // Error toast
              error: {
                style: {
                  background: "#FF6900",
                  color: "#fff",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#FF6900",
                },
              },
            }}
          />
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}