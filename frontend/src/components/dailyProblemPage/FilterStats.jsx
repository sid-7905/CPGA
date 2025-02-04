const FilterStats = ({ problems, filteredCount }) => {
    const totalProblems = problems.length;
    const solvedProblems = problems.filter(p => p.status === "solved").length;
    
    return (
      <div className="flex gap-4 text-sm text-gray-400">
        <span>Total: {totalProblems}</span>
        <span>Solved: {solvedProblems}</span>
        {filteredCount !== totalProblems && (
          <span>Filtered: {filteredCount}</span>
        )}
      </div>
    );
  };

  export default FilterStats;