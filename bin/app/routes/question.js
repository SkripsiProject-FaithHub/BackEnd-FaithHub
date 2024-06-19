const express = require("express");
const authController = require("../../modules/user/user");
const doubtController = require("../../modules/question/question");

const router = express.Router();
router.route("/create").post(authController.authMiddleware, doubtController.createQuestion);
router.route("/update/:questionId").put(authController.authMiddleware, doubtController.editQuestion);
router.route("/delete/:questionId").delete(authController.authMiddleware, doubtController.deleteQuestion);
router.route("/reply/:questionId").post(authController.authMiddleware, doubtController.addReply);
router.route("/vote/:questionId").post(authController.authMiddleware, doubtController.vote);
router.route("/fetchAll").get(authController.authMiddleware, doubtController.getAllQuestion);
router.route("/getQuestionbyTags").post(authController.authMiddleware ,doubtController.getQuestionbyTags); 
router.route("/getUserQuestion").get(authController.authMiddleware ,doubtController.getUserQuestion); 
router.route("/getDetail/:questionId").get(authController.authMiddleware, doubtController.getQuestionDetail);
router.route("/sortReplies/:questionId").post(authController.authMiddleware, doubtController.sortReplies);

module.exports = router;