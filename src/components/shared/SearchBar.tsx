import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';

const SearchBar = () => {
    return (
    <div>
        <form  className='relative' action={"search"}>
            <input type='text' name="q"
            placeholder='Search for event....'
            className='w-full py-3 px-4 pl-12 bg-white rounded-xl border border-gray-200 h-10
            shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
            duration-200 transition-all'/>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Button className='absolute right-3 top-1/2 -translate-y-1/2 bg-purple-500 text-white px-4 py-1.5
        rounded-lg text-sm h-7 font-medium hover:bg-purple-700 transition--colors duration-200'>
            Search
        </Button>
        </form>
    </div>
  )
}

export default SearchBar