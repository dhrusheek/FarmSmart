import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = true, size = 48 }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-slate-900 z-50">
                <Loader2 className="animate-spin text-emerald-600" size={size} />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin text-emerald-600" size={size} />
        </div>
    );
};

export default Loader;
