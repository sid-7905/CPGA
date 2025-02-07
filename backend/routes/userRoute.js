const express = require("express");
const {registerUser, loginUser, addPlatforms} = require("../controllers/userController.jsx");
const router = express.Router();
const multer = require("multer");
var uploader = multer({
    storage: multer.diskStorage({})
})

router.post("/register", uploader.single("file"), registerUser);
router.post("/login", loginUser);

module.exports = router;
