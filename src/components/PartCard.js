import React, { useId, useState } from 'react';
import SectionHeading from './SectionHeading';

export default function PartCard({ part }) {
    const [showVendors, setShowVendors] = useState(false);
    const vendorsId = useId();

    return (
        <div className="bg-panel border border-white/10 p-6 hover:border-signal transition-colors duration-300">
            <div className="flex flex-wrap gap-3 justify-between items-start mb-4">
                <div>
                    <SectionHeading as="h3" anchor={`part-${part.id}`} className="text-xl font-bold uppercase tracking-wide text-white">{part.name}</SectionHeading>
                    <span className="font-mono text-xs text-white/60">ID: {part.id}</span>
                </div>
                <span className="px-3 py-1 border border-signal text-signal font-mono text-[10px] uppercase tracking-[0.2em]">
                    {part.category}
                </span>
            </div>
            <p className="text-white/60 mb-6 min-h-[3rem]">{part.description}</p>
            <button
                type="button"
                aria-expanded={showVendors}
                aria-controls={vendorsId}
                className="w-full text-left font-mono text-xs uppercase tracking-[0.2em] text-signal py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                onClick={() => setShowVendors((shown) => !shown)}
            >
                {showVendors ? 'Hide vendors' : 'Show vendors'}
            </button>
            <div id={vendorsId}>
                {showVendors && (
                    <div className="space-y-2 mt-3">
                        <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal mb-2">Where to Buy</h4>
                        {part.vendors.map((vendor) => (
                            <a
                                key={vendor.url}
                                href={vendor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 bg-white/5 hover:bg-signal-dark text-white hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                            >
                                <span className="font-mono text-xs uppercase tracking-[0.15em]">{vendor.name}</span>
                                <span aria-hidden="true">↗</span>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
