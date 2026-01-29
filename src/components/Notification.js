'use client';

import { useEffect } from 'react';

export default function Notification({ notifications, removeNotification }) {
    useEffect(() => {
        if (notifications.length > 0) {
            const timer = setTimeout(() => {
                removeNotification(notifications[0].id);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notifications, removeNotification]);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
            {notifications.map((notification) => (
                <div 
                    key={notification.id}
                    className={`p-4 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in-right ${
                        notification.type === 'success' 
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : notification.type === 'error'
                            ? 'bg-red-50 border border-red-200 text-red-800'
                            : notification.type === 'warning'
                            ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                            : 'bg-blue-50 border border-blue-200 text-blue-800'
                    }`}
                >
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {notification.type === 'success' && (
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                            {notification.type === 'error' && (
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            {notification.type === 'warning' && (
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium">{notification.message}</p>
                        </div>
                        <button 
                            onClick={() => removeNotification(notification.id)}
                            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
            
            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}