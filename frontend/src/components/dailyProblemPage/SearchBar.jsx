import { Search } from "lucide-react";

const SearchBar = ({ onSearch }) => (
    <div className="w-full h-full flex items-center justify-center">
      <Search
        className="relative left-8 text-gray-400"
        size={20}
      />
      <input
        type="text"
        placeholder="Search problems..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg 
                   border border-gray-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                   transition-colors"
      />
      <div className="w-6 "></div>
    </div>
  );

export default SearchBar;