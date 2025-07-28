const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const cheerio = require("cheerio");
const axios = require("axios");

const addPlatforms = async (req, res) => {
  const userId = req.params.id;
  const platformIds = req.body;

  const user = await UserModel.findById(userId);
  if (user) {
    user.platformIds = platformIds;
    await user.save();
    res.json({ message: "Platform IDs added successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const getProfile = async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject._id;
  userObject.id = user._id;
  res.json({
    user: userObject,
  });
};

// const getAllUsers = async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 5;

//   const skip = (page - 1) * limit;

//   try {
//     const users = await UserModel.find().skip(skip).limit(limit);
//     const totalCount = await UserModel.countDocuments();

//     res.json({ users, totalCount });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching users" });
//   }
// };

const getAllUsers = async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
};

const ccProblemCount = async (req, res) => {
  const userId = req.params.id;
  try {
      // Fetch user from the database
      const user = await UserModel.findOne({ _id: userId }); 
      if (!user) {
          return { error: "User not found in database" };
      }

      const platformID =user?.platformIds?.[0]?.["CodeChef"];
      const url = `https://www.codechef.com/users/${platformID}`;
     
        // Fetch the HTML page
        const { data } = await axios.get(url, { timeout: 5000 });

        // Load HTML into Cheerio
        const $ = cheerio.load(data);

        // Find the "Total Problems Solved" section
        let totalProblemsSolved = null;

        $("h3").each((i, elem) => {
            const text = $(elem).text().trim();
            if (text.includes("Total Problems Solved")) {
                const match = text.match(/\d+/); // Extract first number
                totalProblemsSolved = match ? parseInt(match[0], 10) : null;
            }
        });

        // Send JSON response
        res.json({ totalProblemsSolved });

    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: "Failed to fetch data from CodeChef" });
    }
};


const addDailyProblemPreferences = async (req, res) => {
  const userId = req.user.userID;
  const { problemTags, ratingRange } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.problemTags = problemTags;
    user.ratingRange = ratingRange;
    await user.save();

    res.json({ message: "Daily problem preferences saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getALLDailyProblems = async (req, res) => {
  const userId = req.user.userID;
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user.dailyProblems);
};

const saveDailyProblem = async (req, res) => {
  const userId = req.user.userID;
  const dailyProblem = req.body;
  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const dailyproblem = {
    name: dailyProblem.name,
    rating: dailyProblem.rating,
    tags: dailyProblem.tags,
    link: `https://codeforces.com/contest/${dailyProblem.contestId}/problem/${dailyProblem.index}`,
    points: dailyProblem.points !== 0 ? dailyProblem.points : 500,
  };
  user.dailyProblems.push(dailyproblem);
  await user.save();
  res.json({ message: "Daily problem saved successfully" });
};

const updateProblemStatus = async (req, res) => {
  const userId = req.user.userID;
  const { contestId, index, points } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const Link = `https://codeforces.com/contest/${contestId}/problem/${index}`;
  const problem = user.dailyProblems.find((problem) => problem.link === Link);
  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }
  problem.status = "solved";
  user.dailyPoints += points;
  await user.save();
  res.json({ message: "Problem status updated successfully" });
};

const uploadImage = require("../config/upload.js");

const updateUserInformation = async (req, res) => {
  try {
    const { name, username } = req.body;

    // Validate input
    if (!name || !username) {
      return res.status(400).json({
        success: false,
        message: "Name and username are required",
      });
    }

    // Check if username is already taken by another user
    const existingUser = await UserModel.findOne({
      username,
      _id: { $ne: req.user.userID }, // Exclude current user from check
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
      });
    }

    // Prepare update object
    const updateData = {
      name,
      username,
    };
    let image_url = "";
    if (req.file && req.file.path) {
      image_url = await uploadImage(req.file?.path);
    }

    if (image_url) {
      updateData.image = image_url;
    }

    // Update user in database
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.userID,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const userObject = updatedUser.toObject();
    delete userObject.password;
    delete userObject._id;
    userObject.id = updatedUser._id;

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: userObject,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

const updateEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if email is already taken by another user
    const existingUser = await UserModel.findOne({
      email,
      _id: { $ne: req.user.userID }, // Exclude current user from check
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already taken",
      });
    }

    // Prepare update object
    const updateData = {
      email,
    };

    // Update user in database
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.userID,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Email updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Email update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating email",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Find the user by ID
    const user = await UserModel.findById(req.user.userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify the current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Prepare update object
    const updateData = {
      password: hashedPassword,
    };

    // Update user in the database
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.userID,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Password updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating password",
    });
  }
};

module.exports = {
  addPlatforms,
  getProfile,
  getAllUsers,
  ccProblemCount,
  addDailyProblemPreferences,
  getALLDailyProblems,
  saveDailyProblem,
  updateProblemStatus,
  updateUserInformation,
  updateEmail,
  updatePassword,
};
