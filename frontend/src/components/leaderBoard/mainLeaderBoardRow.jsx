import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50"
                >
                    <div className="w-11/12 max-w-4xl">
                        {children}
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);

const UserComparison = ({ user1, user2, onClose }) => (
    <div className=" backdrop-blur-sm">
        <div className="bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-800 w-11/12 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Profile Comparison</h2>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                >
                    <X className="text-gray-400 hover:text-white" />
                </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1" />
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden shadow-lg mb-2">
                        {user1?.image ? (
                            <img src={user1.image} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-full w-full p-2 text-gray-400" />
                        )}
                    </div>
                    <p className="text-white font-semibold">{user1.name}</p>
                </div>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden shadow-lg mb-2">
                        {user2?.image ? (
                            <img src={user2.image} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-full w-full p-2 text-gray-400" />
                        )}
                    </div>
                    <p className="text-white font-semibold">{user2.name}</p>
                </div>

                {/* Platform Comparisons */}
                {[
                    { key: "codeChefRating", label: "CodeChef Rating" },
                    { key: "leetCodeRating", label: "LeetCode Rating" },
                    { key: "codeForcesRating", label: "CodeForces Rating" }
                ].map(({ key, label }) => (
                    <motion.div 
                        key={key}
                        className="col-span-3 grid grid-cols-3 items-center py-4 border-t border-gray-800"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-gray-400">{label}</div>
                        <div className={`text-center font-semibold ${getRatingColor(user1[key])}`}>
                            {user1[key] || 'N/A'}
                        </div>
                        <div className={`text-center font-semibold ${getRatingColor(user2[key])}`}>
                            {user2[key] || 'N/A'}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
);

const getRatingColor = (rating) => {
  if (!rating) return 'text-gray-500';
  if (rating >= 2000) return 'text-yellow-400';
  if (rating >= 1600) return 'text-purple-400';
  if (rating >= 1200) return 'text-blue-400';
  return 'text-white';
};

const LeaderboardRow = ({ user, rank, userData }) => {
  const [showComparison, setShowComparison] = useState(false);

  const getMedalIcon = (rank) => {
    if (rank === 0) return <span className="text-yellow-400 text-2xl">🥇</span>;
    if (rank === 1) return <span className="text-gray-400 text-2xl">🥈</span>;
    if (rank === 2) return <span className="text-amber-700 text-2xl">🥉</span>;
    return <span className="text-gray-400 font-semibold">{rank + 1}</span>;
  };

  const getProfileLink = (id, platform) => {
    if (!id) return '#';
    switch (platform) {
      case 'CodeChef': return `https://www.codechef.com/users/${id}`;
      case 'LeetCode': return `https://leetcode.com/${id}`;
      case 'CodeForces': return `https://codeforces.com/profile/${id}`;
      default: return '#';
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`group flex flex-wrap md:flex-nowrap items-center w-full lg:w-4/5 gap-1 rounded-xl p-4 
          ${rank < 3 
            ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700" 
            : "bg-gray-900/60 hover:bg-gray-800/80"
          } transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10`}
      >
        <div className="flex items-center gap-6 w-full sm:w-2/6 px-4">
          <div className="flex items-center justify-center w-8">
            {getMedalIcon(rank)}
          </div>
          <motion.div 
            className="w-10 h-10 rounded-full overflow-hidden shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            {user?.image ? (
              <img src={user.image} alt="Profile" className="h-full w-full rounded-full object-cover" />
            ) : (
              <User className="h-full w-full p-1 text-gray-400 object-cover" />
            )}
          </motion.div>
          <NavLink to={`/profile/${user._id}`}>
            <p className="text-white font-semibold hover:text-blue-500 transition-colors">
              {user.name}
            </p>
            <p className="text-gray-400 text-sm hover:text-blue-500 transition-colors">
              @{user.username}
            </p>
          </NavLink>
        </div>

        <div className="flex items-center justify-evenly w-full sm:w-2/6 py-4 sm:py-0">
          {[
            { key: "codeChefRating", platformID: "codeChefID", label: "CodeChef" },
            { key: "leetCodeRating", platformID: "leetCodeID", label: "LeetCode" },
            { key: "codeForcesRating", platformID: "codeForcesID", label: "CodeForces" }
          ].map((platform) => (
            <motion.div 
              key={platform.key} 
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <NavLink
                to={getProfileLink(user[platform.platformID], platform.label)}
                target="_blank"
                className={`font-semibold ${user[platform.key] === 0 
                  ? "text-gray-500" 
                  : "text-white hover:text-blue-500"
                }`}
              >
                {user[platform.key] || "N/A"}
              </NavLink>
              <p className="text-gray-400 text-xs">{platform.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="w-full sm:w-1/6 flex justify-center">
          <NavLink to={`/profile/${user._id}`} className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg
                       transition-colors duration-300 flex items-center justify-center gap-2"
            >
              View Profile
            </motion.button>
          </NavLink>
        </div>
        <div className="w-full sm:w-1/6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg
                     transition-colors duration-300 flex items-center justify-center gap-2"
            onClick={() => setShowComparison(true)}
          >
            Compare Profile
          </motion.button>
        </div>
      </motion.div>

      <Modal isOpen={showComparison} onClose={() => setShowComparison(false)}>
        <UserComparison 
          user1={user} 
          user2={userData} 
          onClose={() => setShowComparison(false)} 
        />
      </Modal>
    </>
  );
};

export default LeaderboardRow;