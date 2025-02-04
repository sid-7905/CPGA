const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussionController.jsx");
const auth = require("../middleware/auth");
const {
    addComment,
    getComments,
    toggleLike,
    toggleDislike,
  } = require('../controllers/commentController.jsx');

router.use(auth); 

router.post("/create", discussionController.createDiscussion);
router.get("/all", discussionController.getAllDiscussions);
router.post("/:discussionId/like", discussionController.toggleLike);
router.post("/:discussionId/dislike", discussionController.toggleDislike);
router.post('/:discussionId/comments/:commentId/like', toggleLike);
router.post('/:discussionId/comments/:commentId/dislike', toggleDislike);
router.post('/:discussionId/comment', addComment);
router.get('/:discussionId/comments', getComments);

module.exports = router;