'use client';

export default function SkeletonLoader({ type = 'table', rows = 5 }) {
    if (type === 'table') {
        return (
            <div className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="space-y-3">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                        <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                    </div>
                    
                    {/* Table Rows */}
                    {Array.from({ length: rows }).map((_, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100">
                            <div className="h-4 bg-gray-100 rounded col-span-1"></div>
                            <div className="h-4 bg-gray-100 rounded col-span-1"></div>
                            <div className="h-4 bg-gray-100 rounded col-span-1"></div>
                            <div className="h-4 bg-gray-100 rounded col-span-1"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'card') {
        return (
            <div className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                </div>
            </div>
        );
    }

    if (type === 'stats') {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="card text-center relative overflow-hidden group py-6 animate-pulse">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gray-200"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
    );
}