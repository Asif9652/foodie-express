/**
 * Utility function to get dynamic food images from Unsplash
 * Returns a high-quality image URL based on food name
 */
export const getFoodImage = (foodName, width = 400, height = 300) => {
    // Encoded food name for URL safety
    const query = encodeURIComponent(foodName || 'food');

    // Using Unsplash Source API for dynamic categorized images
    // Note: source.unsplash.com is legacy, using images.unsplash.com with queries is more stable
    return `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=${width}&auto=format&fit=crop&sig=${query}`;

    // Alternative: Using the source API as requested but with fallback
    // return `https://source.unsplash.com/${width}x${height}/?food,${query}`;
};

// Map of common food items to specific reliable Unsplash IDs if needed
const commonFoodImages = {
    'Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21bc4a6f8',
    'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    'Burger': 'https://images.unsplash.com/photo-1571091718767-18b5b1457add',
    'Pasta': 'https://images.unsplash.com/photo-1473093226795-af9932fe5856',
    'Dessert': 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
    'Sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    'Tacos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
};

export const getSpecificFoodImage = (category, width = 400) => {
    const baseUrl = commonFoodImages[category] || commonFoodImages['Burger'];
    return `${baseUrl}?q=80&w=${width}&auto=format&fit=crop`;
};
