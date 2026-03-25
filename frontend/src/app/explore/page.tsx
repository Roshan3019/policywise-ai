"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, BookA } from "lucide-react";

// Mock glossary data since there's no backend endpoint for dictionary terms yet.
const TERMINOLOGY = [
  { term: "Add-ons", meaning: "Extra coverage options you can purchase in addition to your basic insurance policy (e.g., Engine Protection, Zero Depreciation)." },
  { term: "Claim Settlement Ratio (CSR)", meaning: "The percentage of insurance claims settled by an insurer compared to the total number of claims received. A higher CSR indicates better reliability." },
  { term: "Comprehensive Insurance", meaning: "A policy that covers both third-party liabilities and damages to your own vehicle due to accidents, theft, fire, or natural calamities." },
  { term: "Deductible", meaning: "The amount you must pay out-of-pocket before your insurance company pays a claim. Higher deductibles usually mean lower premiums." },
  { term: "Engine Protection Cover", meaning: "An add-on that covers the cost of repairing or replacing a damaged car engine, which is typically not covered under a standard policy." },
  { term: "Insured Declared Value (IDV)", meaning: "The maximum sum assured fixed by the insurer which is provided on theft or total loss of vehicle. It essentially represents the current market value of the car." },
  { term: "No Claim Bonus (NCB)", meaning: "A discount in premium offered by car insurance companies to policyholders for not making any claims during the preceding policy term." },
  { term: "Premium", meaning: "The amount you pay periodically (usually annually) to the insurance company to keep your policy active." },
  { term: "Standalone Own Damage (OD)", meaning: "A policy that strictly covers damage to your own car, purchased separately from Third-Party cover." },
  { term: "Third-Party Insurance", meaning: "Mandatory by law in India, this covers injuries or property damage caused by your car to a third party. It does NOT cover damage to your own car." },
  { term: "Zero Depreciation", meaning: "An add-on cover that offers complete coverage without factoring in depreciation, ensuring you receive the full claim amount for replaced parts." },
];

export default function ExplorePage() {
  const [query, setQuery] = useState("");

  const filteredTerms = TERMINOLOGY.filter(t => 
    t.term.toLowerCase().includes(query.toLowerCase()) || 
    t.meaning.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12 animate-fade-up">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-6 shadow-sm border border-emerald-100">
          <BookA size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight mb-4">
          Insurance <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Dictionary</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Confused by a term in your policy? Search our simplified jargon-free dictionary to understand exactly what you are paying for.
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-16 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-slate-400" />
        </div>
        <Input 
          type="text"
          placeholder="Search for terms like 'IDV', 'NCB', or 'Deductible'..."
          className="pl-14 h-16 text-lg rounded-2xl border-slate-200 shadow-md shadow-slate-100 focus-visible:ring-emerald-500 focus-visible:ring-2 bg-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-2 sm:p-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
        {filteredTerms.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Search className="w-10 h-10 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-900">No definitions found</p>
            <p className="mt-1">We couldn't find anything matching "{query}".</p>
          </div>
        ) : (
          <Accordion className="w-full">
            {filteredTerms.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-100 px-4">
                <AccordionTrigger className="text-lg font-bold font-heading text-slate-800 hover:text-emerald-600 py-6">
                  {item.term}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed text-base pb-6">
                  {item.meaning}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Still confused?</span>
                    <a href={`/chat?q=Explain ${item.term} with an example`} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
                      Ask AI for an example →
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </main>
  );
}
