import React, { useState } from 'react';

const ShowLCBadges = ({ badges }) => {
  const [activeHover, setActiveHover] = useState(null);

  if (!badges || badges.length === 0) {
    return (
      <div className="flex justify-center items-center p-4">
        <p className="text-red-500">No badges available</p>
      </div>
    );
  }

  const handleMouseEnter = (id) => {
    setActiveHover(id);
  };

  const handleMouseLeave = () => {
    setActiveHover(null);
  };

  function getFullIconUrl(icon) {
    const baseUrl = "https://leetcode.com";
    return icon.startsWith("https://") ? icon : baseUrl + icon;
}
return (
    <div className="w-full max-w-3xl flex flex-col items-center justify-center rounded-lg shadow-sm p-4">
        <h2 className="text-xl text-center font-semibold text-cyan-600 mb-4">
            LeetCode Badges
        </h2>
        <div className="flex flex-wrap items-center justify-center ">
            {badges.map((badge) => {
                const iconName = badge.icon.split('/').pop();
                return (
                    <div
                        key={badge.id}
                        className="relative group"
                        onMouseEnter={() => handleMouseEnter(badge.id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="flex flex-col items-center p-2 rounded-lg hover:bg-cyan-950 transition-all duration-300">
                            <div className="w-24 h-24 relative">
                                {activeHover === badge.id && badge.medal?.config?.iconGif ? (
                                    <img
                                        src={badge.medal.config.iconGif}
                                        alt={badge.displayName}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <img
                                        src={getFullIconUrl(badge.icon)}
                                        alt={badge.displayName}
                                        className="w-full h-full object-contain"
                                    />
                                )}
                            </div>
                            <div className="mt-2 text-center">
                                <p className="text-sm font-medium text-gray-100">{badge.displayName}</p>
                                <p className="text-xs text-gray-200">
                                    {new Date(badge.creationDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            {activeHover === badge.id && badge.hoverText && (
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-2 px-3 rounded shadow-lg whitespace-pre-wrap z-10">
                                    {badge.hoverText}
                                    <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-800"></div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);
};

export default ShowLCBadges;