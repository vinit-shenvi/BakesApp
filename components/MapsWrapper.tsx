import React, { ReactNode } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface MapsWrapperProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export const MapsWrapper: React.FC<MapsWrapperProps> = ({ children, fallback }) => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ['places', 'geometry'],
    });

    if (loadError) {
        return <div className="p-4 text-red-500 text-sm font-bold bg-red-50 rounded-xl">Map Error: {loadError.message}</div>;
    }

    if (!isLoaded) {
        return fallback ? <>{fallback}</> : <div className="w-full h-full bg-stone-100 animate-pulse rounded-2xl flex items-center justify-center text-stone-400 text-xs font-bold">Loading Map...</div>;
    }

    return <>{children}</>;
};
