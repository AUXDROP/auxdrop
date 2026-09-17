import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://auxdrop.com"),
  title: "AUXDROP — Beatmakers. Go head-to-head.",
  description:
    "Compete in timed Beat Battles, build your Beatmaker profile, and sell beats in your own Shop. Sign up for early access.",
  openGraph: {
    siteName: "AUXDROP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${syne.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-canvas font-sans text-on-dark antialiased">
        {children}
      </body>
    </html>
  );
}
