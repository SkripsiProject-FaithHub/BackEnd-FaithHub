    const express = require("express");
    const authController = require("../../modules/user/user");

    const router = express.Router();
    router.route("/signup").post(authController.registerUser);
    router.route("/login").post(authController.login);
    // router.route('/logout').post(authController.protect, authController.logout);
    module.exports = router;