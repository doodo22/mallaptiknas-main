"use client";
import React, { useState } from 'react';

export default function FaqAccordion({ title, items }) {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);

    const toggleItem = (index) => {
        if (openIndex === index) {
            setOpenIndex(null);
        } else {
            setOpenIndex(index);
        }
    };

    return (
        <div className="mb-4 border border-blue-200 rounded-xl bg-white shadow-sm overflow-hidden">
            <button 
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full px-6 py-4 flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition-colors focus:outline-none"
            >
                <h3 className="text-lg font-bold text-blue-900 text-left pr-4">{title}</h3>
                <span className={`text-blue-500 transform transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`}>
                    <i className="fas fa-chevron-down text-xl"></i>
                </span>
            </button>
            
            <div className={`transition-all duration-300 ease-in-out ${isCategoryOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="p-4 space-y-3 bg-white">
                    {items.map((item, index) => (
                        <div key={index} className="border border-gray-100 rounded-lg overflow-hidden bg-slate-50 hover:border-blue-200 transition-colors">
                            <button 
                                className="w-full px-5 py-3 text-left flex justify-between items-center focus:outline-none"
                                onClick={() => toggleItem(index)}
                            >
                                <span className="font-semibold text-gray-700 pr-4">{item.q}</span>
                                <span className={`text-gray-400 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                    <i className="fas fa-chevron-down text-sm"></i>
                                </span>
                            </button>
                            
                            <div className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                <div className="px-5 pb-4 pt-1 text-gray-600 border-t border-gray-200 whitespace-pre-line text-sm leading-relaxed bg-white">
                                    {item.a}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
