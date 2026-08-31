import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zylomog (social media)",
  description: "Connect, share, and express yourself on Zylomog. Explore real-time updates, share your favorite moments, and discover stories from people around the globe.",
  keywords: [
    "Zylomog",
    "social media",
    "photo sharing",
    "social network",
    "online community",
    "connect friends",
    "social feed",
    "share moments",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
