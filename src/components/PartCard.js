import React, { useState } from 'react';

export default function PartCard({ part }) {
    const [showVendors, setShowVendors] = useState(false);

    return (
        <div
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            onMouseEnter={() => setShowVendors(true)}
            onMouseLeave={() => setShowVendors(false)}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-navy-blue">{part.name}</h3>
                    <span className="text-sm text-gray-500 font-mono">ID: {part.id}</span>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full uppercase tracking-wide font-semibold">
                    {part.category}
                </span>
            </div>

            <p className="text-gray-700 mb-6 min-h-[3rem]">{part.description}</p>

            <div className={`transition-all duration-300 overflow-hidden ${showVendors ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wider">Where to Buy</h4>
                <div className="space-y-2">
                    {part.vendors.map((vendor, index) => (
                        <a
                            key={index}
                            href={vendor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors group"
                        >
                            <span className="font-medium">{vendor.name}</span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    ))}
                </div>
            </div>

            {!showVendors && (
                <div className="text-center text-sky-600 text-sm font-medium mt-2">
                    Hover to see vendors
                </div>
            )}
        </div>
    );
}
