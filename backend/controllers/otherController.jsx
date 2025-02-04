const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");

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
    user: userObject
  });
};

const getAllUsers = async (req, res) => {
  const users = await UserModel.find();
  res.json(users);
};

const puppeteer = require("puppeteer");

const ccProblemCount = async (req, res) => {
  const { userHandle } = req.body;

  if (!userHandle) {
    return res.status(400).json({ error: "User handle is required" });
  }

  const url = `https://www.codechef.com/users/${userHandle}`;

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to CodeChef user page
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Extract the "Total Problems Solved" text
    const totalProblemsSolved = await page.evaluate(() => {
      const h3Tag = Array.from(document.querySelectorAll("h3")).find((h3) =>
        h3.textContent.includes("Total Problems Solved")
      );
      if (h3Tag) {
        // Use a regular expression to extract the integer value
        const match = h3Tag.textContent.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
      }

      return null;
    });

    // Close the browser
    await browser.close();

    if (totalProblemsSolved) {
      res.json({ totalProblemsSolved });
    } else {
      res.status(404).json({ error: "User or data not found" });
    }
  } catch (error) {
    console.error(`Failed to fetch the page: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
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

    const image = req.file ? req.file.filename : "";
    if (image) {
      updateData.image = image;
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
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
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
  updatePassword
};
