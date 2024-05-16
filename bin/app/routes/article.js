const express = require("express");
const articleController = require("../../modules/article/article");
const authController = require("../../modules/user/user");

const router = express.Router();

router.route("/createArticle").post(authController.authMiddleware, articleController.createArticle);

router.route("/get/all").get(authController.authMiddleware, articleController.getAllArticle);
// router.route("/fetch/options").post(authController.protect, articleController.fetchOptions);
// router.route("/vote").post(authController.protect, articleController.vote);

module.exports = router;