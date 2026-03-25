import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
    <html lang="en" className={cn("font-sans", inter.variable, outfit.variable)}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
