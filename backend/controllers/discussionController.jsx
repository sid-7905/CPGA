const Discussion = require("../models/discussionModel");

const discussionController = {
  // Create a new discussion
  createDiscussion: async (req, res) => {
    try {
      let { title, content, tags } = req.body;
      if(tags === "") {
        tags = ['General'];
      }
      const discussion = new Discussion({
        title,
        content,
        tags,
        author: req.user.userID,
      });

      await discussion.save();
      await discussion.populate('author', 'name username image');
      res.status(201).json({
        status: "success",
        discussion
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message
      });
    }
  },

  // Get all discussions with pagination and search
  getAllDiscussions: async (req, res) => {
    try {
      const { page = 1, limit = 5, search = "" } = req.query;
      const skip = (page - 1) * limit;
      const query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ],
      };
      const discussions = await Discussion.find(query)
        .populate('author', 'name username image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const totalPages = Math.ceil((await Discussion.countDocuments(query)) / limit);
      res.json({
        status: "success",
        discussions,
        totalPages
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message
      });
    }
  },
  // Toggle like on discussion
  toggleLike: async (req, res) => {
    try {
      const { discussionId } = req.params;
      const userId = req.user.userID;

      const discussion = await Discussion.findById(discussionId);
      if (!discussion) {
        return res.status(404).json({
          status: "failed",
          message: "Discussion not found"
        });
      }

      const likeIndex = discussion.likes.indexOf(userId);
      const dislikeIndex = discussion.dislikes.indexOf(userId);

      if (likeIndex > -1) {
        discussion.likes.splice(likeIndex, 1);
      } else {
        if (dislikeIndex > -1) {
          discussion.dislikes.splice(dislikeIndex, 1);
        }
        discussion.likes.push(userId);
      }

      await discussion.save();
      res.json({
        status: "success",
        discussion
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message
      });
    }
  },

  // Toggle dislike on discussion
  toggleDislike: async (req, res) => {
    try {
      const { discussionId } = req.params;
      const userId = req.user.userID;

      const discussion = await Discussion.findById(discussionId);
      if (!discussion) {
        return res.status(404).json({
          status: "failed",
          message: "Discussion not found"
        });
      }

      const dislikeIndex = discussion.dislikes.indexOf(userId);
      const likeIndex = discussion.likes.indexOf(userId);

      if (dislikeIndex > -1) {
        discussion.dislikes.splice(dislikeIndex, 1);
      } else {
        discussion.dislikes.push(userId);
        if (likeIndex > -1) {
          discussion.likes.splice(likeIndex, 1);
        }
      }

      await discussion.save();
      res.json({
        status: "success",
        discussion
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        message: error.message
      });
    }
  }
};

module.exports = discussionController;