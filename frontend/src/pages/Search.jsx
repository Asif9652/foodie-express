import React from 'react';
import SearchBar from '../components/SearchBar';

const Search = () => {
    return (
        <div className="pt-28 pb-32 min-h-screen bg-gray-50 px-4">
            <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tighter">Find what <br /><span className="text-primary-600">you crave</span></h1>
            <div className="relative z-50">
                <SearchBar isMobile />
            </div>
        </div>
    );
};

export default Search;
