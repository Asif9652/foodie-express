import { Search } from 'lucide-react';

const SearchBar = ({ placeholder, onSearch }) => {
    return (
        <div className="relative w-full max-w-2xl mx-auto md:mx-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
                type="text"
                onChange={(e) => onSearch && onSearch(e.target.value)}
                placeholder={placeholder || "Search restaurants, cuisines..."}
                className="input-field pl-12 py-4 shadow-sm hover:shadow-md transition-shadow"
            />
        </div>
    );
};

export default SearchBar;
