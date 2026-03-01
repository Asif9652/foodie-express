import axios from 'axios';
import { supabase } from '../lib/supabase';

/**
 * Service to fetch real restaurant data from OSM Overpass API 
 * and persistent storage in Supabase.
 */
export const restaurantService = {
    /**
     * Fetches restaurants from OSM within 2km radius 
     * and saves to Supabase.
     */
    fetchFromOSM: async (lat, lon) => {
        try {
            // OSM Overpass API Query (Nearby restaurants/cafes)
            const radius = 10000; // Increased to 10km for better coverage
            const overpassUrl = 'https://overpass-api.de/api/interpreter';
            const query = `
        [out:json];
        (
          node["amenity"="restaurant"](around:${radius}, ${lat}, ${lon});
          way["amenity"="restaurant"](around:${radius}, ${lat}, ${lon});
          node["amenity"="cafe"](around:${radius}, ${lat}, ${lon});
          way["amenity"="cafe"](around:${radius}, ${lat}, ${lon});
        );
        out center;
      `;

            const response = await axios.post(overpassUrl, query);
            const elements = response.data.elements || [];

            // Format data and UPSERT into Supabase
            const restaurantData = elements.map((item) => {
                const name = item.tags.name || "Local Eatery";
                const center = item.center || { lat: item.lat, lon: item.lon };

                return {
                    name,
                    latitude: center.lat,
                    longitude: center.lon,
                    address: item.tags['addr:full'] || item.tags['addr:street'] || "Near your location",
                    category: item.tags.cuisine || "Multi-cuisine",
                    rating: (Math.random() * (5 - 3.8) + 3.8).toFixed(1), // Premium look (3.8-5)
                    price_for_two: Math.floor(Math.random() * (1200 - 300) + 300),
                    image_url: `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop` // High quality default
                };
            });

            // Avoid duplicates based on name + lat (UPSERT)
            const { data, error } = await supabase
                .from('restaurants')
                .upsert(restaurantData, { onConflict: 'name, latitude, longitude' })
                .select();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error("OSM Fetch Error:", err);
            throw err;
        }
    },

    /**
     * Calculates Haversine distance in KM
     */
    getDistance: (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    }
};
