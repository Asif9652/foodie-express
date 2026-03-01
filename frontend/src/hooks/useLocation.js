import { useState, useEffect } from 'react';

/**
 * Custom hook to detect user location using Browser Geolocation API
 */
export const useLocation = () => {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
        loading: true,
        error: null,
    });

    const getPosition = (options) => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    };

    useEffect(() => {
        const detect = async () => {
            if (!navigator.geolocation) {
                setLocation({
                    latitude: null,
                    longitude: null,
                    loading: false,
                    error: "Geolocation is not supported by your browser.",
                });
                return;
            }

            try {
                const position = await getPosition({
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                });

                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    loading: false,
                    error: null,
                });
            } catch (err) {
                let errorMsg = "Location permission required to show nearby restaurants.";
                if (err.code === 2) errorMsg = "Location unavailable.";
                if (err.code === 3) errorMsg = "Location request timed out.";

                setLocation({
                    latitude: null,
                    longitude: null,
                    loading: false,
                    error: errorMsg,
                });
            }
        };

        detect();
    }, []);

    return location;
};
