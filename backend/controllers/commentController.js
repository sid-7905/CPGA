const Discussion = require('../models/discussionModel');
const Comment = require('../models/commentModel');
const mongoose = require('mongoose');

// Add a comment to a discussion
exports.addComment = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { content } = req.body;
    const userId = req.user.userID;

    if (!content) {
      return res.status(400).json({
        status: 'error',
        message: 'Comment content is required'
      });
    }

    // Create new comment
    const comment = new Comment({
      content,
      author: userId,
      discussion: discussionId
    });

    await comment.save();

    // Add comment to discussion
    await Discussion.findByIdAndUpdate(
      discussionId,
      { $push: { comments: comment._id } }
    );

    // Populate author details before sending response
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name image');

    return res.status(201).json({
      status: 'success',
      comment: populatedComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error adding comment'
    });
  }
};

// Get all comments for a discussion
exports.getComments = async (req, res) => {
  try {
    const { discussionId } = req.params;
    
    const comments = await Comment.find({ discussion: discussionId })
      .populate('author', 'name image')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error fetching comments'
    });
  }
};

// Toggle like on comment
exports.toggleLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userID;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        status: "failed",
        message: "Comment not found"
      });
    }

    const likeIndex = comment.likes.indexOf(userId);
    const dislikeIndex = comment.dislikes.indexOf(userId);

    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      if (dislikeIndex > -1) {
        comment.dislikes.splice(dislikeIndex, 1);
      }
      comment.likes.push(userId);
    }

    await comment.save();
    res.json({
      status: "success",
      comment
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message
    });
  }
};

// Toggle dislike on comment
exports.toggleDislike = async (req, res) => {
  try {
    const {commentId } = req.params;
    const userId = req.user.userID;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        status: "failed",
        message: "Comment not found"
      });
    }

    const dislikeIndex = comment.dislikes.indexOf(userId);
    const likeIndex = comment.likes.indexOf(userId);

    if (dislikeIndex > -1) {
      comment.dislikes.splice(dislikeIndex, 1);
    } else {
      if (likeIndex > -1) {
        comment.likes.splice(likeIndex, 1);
      }
      comment.dislikes.push(userId);
    }

    await comment.save();
    res.json({
      status: "success",
      comment
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message
    });
  }
};
