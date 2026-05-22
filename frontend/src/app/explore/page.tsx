"use client";

import { useState } from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, BookA } from "lucide-react";

const TERMINOLOGY = [
  { term: "Add-ons", meaning: "Extra coverage options purchased in addition to your basic policy, such as Engine Protection or Zero Depreciation." },
  { term: "Claim Settlement Ratio (CSR)", meaning: "The percentage of claims settled by an insurer. A CSR above 95% is considered excellent and indicates strong reliability." },
  { term: "Comprehensive Insurance", meaning: "Covers both third-party liabilities and damage to your own vehicle from accidents, theft, fire, or natural calamities." },
  { term: "Deductible", meaning: "The amount you must pay out-of-pocket before the insurer pays a claim. Higher deductibles typically lower your premium." },
  { term: "Engine Protection Cover", meaning: "An add-on covering repair or replacement of a damaged engine, which is usually excluded from standard policies." },
  { term: "Insured Declared Value (IDV)", meaning: "The current market value of your car after depreciation — the maximum amount the insurer pays on total loss or theft." },
  { term: "No Claim Bonus (NCB)", meaning: "A premium discount for not making claims in the previous year. Ranges from 20% to 50% for 5+ consecutive claim-free years." },
  { term: "Premium", meaning: "The periodic amount paid to the insurance company to keep your policy active." },
  { term: "Third-Party Insurance", meaning: "Mandatory by law in India. Covers injuries and property damage caused to others, but NOT damage to your own car." },
  { term: "Zero Depreciation", meaning: "An add-on ensuring full payment for replaced parts without any deduction for depreciation." },
];

export default function ExplorePage() {
  const [query, setQuery] = useState("");

  const filtered = TERMINOLOGY.filter(
    (t) =>
      t.term.toLowerCase().includes(query.toLowerCase()) ||
      t.meaning.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white pt-20 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Very subtle background sparkles */}
      <SparklesCore background="transparent" minSize={0.2} maxSize={0.6} particleDensity={40} particleColor="#FFFFFF" speed={0.5} className="fixed inset-0 w-full h-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 mb-6">
            <BookA size={32} strokeWidth={2} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">Insurance Dictionary</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Confused by policy jargon? Search our simplified dictionary to instantly understand what you&apos;re paying for.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search for IDV, NCB, Zero Depreciation..."
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 focus:outline-none focus:border-indigo-500/50 text-base transition-colors"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Accordions */}
        <div className="glass rounded-3xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-neutral-500">
              <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p className="text-white font-medium mb-1">No results found</p>
              <p>We couldn&apos;t find anything matching &quot;{query}&quot;</p>
            </div>
          ) : (
            <Accordion className="w-full divide-y divide-white/5">
              {filtered.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="px-6">
                  <AccordionTrigger className="text-base font-bold text-white hover:text-indigo-400 py-5 transition-colors">
                    {item.term}
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-300 leading-relaxed text-base pb-5">
                    {item.meaning}
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">Still confused?</span>
                      <a href={`/chat?q=Explain ${item.term} with an example`} className="text-sm font-semibold text-indigo-400 hover:text-sky-400 transition-colors">
                        Ask AI for an example →
                      </a>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </main>
  );
}
