import type { Metadata } from "next";
import { Quicksand, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "../app/globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quick",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Celeparty — Marketplace Event",
  description: "Temukan dan beli jasa event terbaik untuk perayaan Anda",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${quicksand.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-c-blue focus:text-white focus:rounded-lg focus:font-quick focus:font-semibold"
        >
          Lewati ke Konten
        </a>
        <div id="main-content">{children}</div>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
            },
          }}
        />
      </body>
    </html>
  );
}
