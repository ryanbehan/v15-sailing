import Head from 'next/head';
import { useState } from 'react';
import PartCard from '../../components/PartCard';
import partsData from '../../../content/parts-catalog.json';

export default function PartsCatalog() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(partsData.map(p => p.category))];

    const filteredParts = partsData.filter(part => {
        const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            part.id.includes(searchTerm) ||
            part.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || part.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Head>
                <title>Parts Finder | V-15 Sailing</title>
            </Head>

            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-navy-blue mb-4">Vanguard 15 Parts Finder</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Find the exact part you need and compare options from trusted vendors.
                    </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="w-full md:w-1/3">
                            <label htmlFor="search" className="sr-only">Search parts</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="search"
                                    placeholder="Search by name, ID, or description..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                                            ? 'bg-navy-blue text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredParts.map(part => (
                        <PartCard key={part.id} part={part} />
                    ))}
                </div>

                {filteredParts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No parts found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                            className="mt-4 text-sky-600 hover:text-sky-800 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
