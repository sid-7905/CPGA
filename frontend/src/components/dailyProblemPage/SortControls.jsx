import { ArrowUpDown, CheckCircle2, XCircle, Clock, Trophy } from "lucide-react";
import React from 'react';

const SortControls = ({ onSort, currentSort }) => {
    const sortOptions = [
      { id: 'date-new', label: 'Newest First', icon: Clock },
      { id: 'date-old', label: 'Oldest First', icon: Clock },
      { id: 'difficulty-high', label: 'Hardest First', icon: Trophy },
      { id: 'difficulty-low', label: 'Easiest First', icon: Trophy },
      { id: 'solved', label: 'Solved First', icon: CheckCircle2 },
      { id: 'unsolved', label: 'Unsolved First', icon: XCircle },
    ];
  
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">Sort by</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onSort(id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                ${currentSort === id 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  };

export default SortControls;