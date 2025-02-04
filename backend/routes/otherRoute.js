const express = require("express");
const router = express.Router();
const { getProfile, addPlatforms, getAllUsers, ccProblemCount, addDailyProblemPreferences, getALLDailyProblems, saveDailyProblem, updateProblemStatus, updateUserInformation, updateEmail, updatePassword} = require("../controllers/otherController.jsx");
const authenticate = require("../middleware/auth.js");
const upload = require("../config/multerConfig");

router.use(authenticate);

router.put('/update-password', updatePassword);
router.post('/update-email', updateEmail);
router.post('/update-user-info', upload.single("file"), updateUserInformation);
router.post('/update-problem-status', updateProblemStatus);
router.post('/save-daily-problem', saveDailyProblem);
router.get('/get-all-daily-problems', getALLDailyProblems);
router.post('/daily-problem-preferences', addDailyProblemPreferences);
router.get('/getAllUsers', getAllUsers);
router.post('/getcc-problem-count', ccProblemCount);
router.post("/:id/addPlatforms", addPlatforms);
router.get("/:id", getProfile);

module.exports = router;
