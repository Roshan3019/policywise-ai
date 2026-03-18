import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PolicyWise AI — Intelligent Car Insurance Advisor",
  description:
    "Understand, compare, and choose the best car insurance policy with AI-powered explanations and smart recommendations.",
  keywords: ["car insurance", "insurance comparison", "AI insurance", "policy advisor", "India"],
  openGraph: {
    title: "PolicyWise AI",
    description: "Smart car insurance comparison & AI recommendations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
